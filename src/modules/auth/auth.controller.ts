import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { ApiResponse } from '@/utils/ApiResponse';
import { authService } from './auth.service';
import { env } from '@/config/env';

class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    // Set refresh token in HTTP-only secure cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth',
    });

    res.status(200).json(
      new ApiResponse(200, {
        admin: result.admin,
        accessToken: result.accessToken,
      }, 'Login successful'),
    );
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    // Get refresh token from cookie or request body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    const result = await authService.refreshToken(refreshToken);

    // Set new refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth',
    });

    res.status(200).json(
      new ApiResponse(200, {
        accessToken: result.accessToken,
      }, 'Token refreshed successfully'),
    );
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(' ')[1] || '';

    await authService.logout(accessToken, req.admin!.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });

    res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully'),
    );
  });

  /**
   * GET /api/v1/auth/me
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const admin = await authService.getProfile(req.admin!.id);

    res.status(200).json(
      new ApiResponse(200, admin, 'Profile retrieved successfully'),
    );
  });
}

export const authController = new AuthController();
