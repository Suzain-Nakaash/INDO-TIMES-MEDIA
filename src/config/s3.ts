import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { env } from './env';

export const s3Client = new S3Client({
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: env.S3_FORCE_PATH_STYLE,
});

/**
 * Ensure the S3 bucket exists, creating it if necessary
 */
export async function ensureBucket(): Promise<void> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: env.S3_BUCKET_NAME }));
    console.log(`✅ S3 bucket "${env.S3_BUCKET_NAME}" exists`);
  } catch {
    try {
      await s3Client.send(new CreateBucketCommand({ Bucket: env.S3_BUCKET_NAME }));
      console.log(`✅ S3 bucket "${env.S3_BUCKET_NAME}" created`);
    } catch (createError) {
      console.warn('⚠️ Could not create S3 bucket:', (createError as Error).message);
    }
  }
}

/**
 * Upload a file buffer to S3
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read',
    }),
  );

  // Construct the public URL
  if (env.S3_FORCE_PATH_STYLE) {
    return `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`;
  }
  return `${env.S3_ENDPOINT}/${key}`;
}

/**
 * Delete a file from S3 by key
 */
export async function deleteFromS3(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
}

/**
 * Get a file from S3 by key
 */
export async function getFromS3(key: string) {
  return s3Client.send(
    new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
}
