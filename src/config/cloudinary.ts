import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resource_type: string;
  original_filename: string;
}

/**
 * Upload a buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  options: {
    folder: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    publicId?: string;
  },
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `indotimesmedia/${options.folder}`,
        resource_type: options.resourceType || 'auto',
        public_id: options.publicId,
        overwrite: true,
        transformation:
          options.resourceType === 'image'
            ? [{ quality: 'auto', fetch_format: 'auto' }]
            : undefined,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as unknown as CloudinaryUploadResult);
        }
      },
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete a file from Cloudinary by public_id
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
