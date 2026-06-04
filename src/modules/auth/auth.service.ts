import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';
import { CACHE_KEYS } from '@/utils/constants';
import { JwtPayload } from '@/types';
import { LoginInput } from './auth.schema';

class AuthService {
  /**
   * Authenticate admin with email and password.
   * Returns access token and refresh token.
   */
  async login(input: LoginInput) {
    const { email, password } = input;

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(admin.id, admin.email);
    const refreshToken = this.generateRefreshToken(admin.id, admin.email);

    // Store refresh token in Redis
    await redis.set(
      `refresh:${admin.id}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60, // 7 days
    );

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    // Verify refresh token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      throw ApiError.unauthorized('Invalid token type');
    }

    // Check if refresh token exists in Redis
    const storedToken = await redis.get(`refresh:${decoded.id}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    // Verify admin still exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      throw ApiError.unauthorized('Admin not found');
    }

    // Generate new tokens (token rotation)
    const newAccessToken = this.generateAccessToken(admin.id, admin.email);
    const newRefreshToken = this.generateRefreshToken(admin.id, admin.email);

    // Store new refresh token, replacing old one
    await redis.set(
      `refresh:${admin.id}`,
      newRefreshToken,
      'EX',
      7 * 24 * 60 * 60,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout — blacklist the access token and remove refresh token
   */
  async logout(accessToken: string, adminId: string) {
    // Blacklist the access token until it expires
    try {
      const decoded = jwt.decode(accessToken) as JwtPayload & { exp: number };
      if (decoded?.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redis.set(`${CACHE_KEYS.tokenBlacklist}:${accessToken}`, '1', 'EX', ttl);
        }
      }
    } catch {
      // If we can't decode the token, that's fine — it's already invalid
    }

    // Remove refresh token from Redis
    await redis.del(`refresh:${adminId}`);
  }

  /**
   * Get current admin profile
   */
  async getProfile(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw ApiError.notFound('Admin not found');
    }

    return admin;
  }

  // ── Private helpers ───────────────────────────────────────

  private generateAccessToken(id: string, email: string): string {
    return jwt.sign(
      { id, email, type: 'access' } as JwtPayload,
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY } as jwt.SignOptions,
    );
  }

  private generateRefreshToken(id: string, email: string): string {
    return jwt.sign(
      { id, email, type: 'refresh' } as JwtPayload,
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY } as jwt.SignOptions,
    );
  }
}

export const authService = new AuthService();
