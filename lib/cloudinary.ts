import { v2 as cloudinary } from 'cloudinary';

/**
 * Checks whether Cloudinary credentials have been configured in .env
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return !!(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes('your-cloudinary') &&
    !apiKey.includes('your-cloudinary') &&
    !apiSecret.includes('your-cloudinary') &&
    cloudName.trim().length > 0 &&
    apiKey.trim().length > 0 &&
    apiSecret.trim().length > 0
  );
}

/**
 * Uploads an image buffer or base64 data URI to Cloudinary via official SDK
 * Returns the secure HTTPS Cloudinary URL
 */
export async function uploadToCloudinary(
  fileInput: Buffer | string,
  folder = 'shikkha_nova/avatars',
  publicIdPrefix?: string
): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary এনভায়রনমেন্ট ভেরিয়েবল (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) পাওয়া যায়নি');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  let fileData: string;
  if (Buffer.isBuffer(fileInput)) {
    fileData = `data:image/jpeg;base64,${fileInput.toString('base64')}`;
  } else {
    fileData = fileInput;
  }

  const cleanPublicId = publicIdPrefix
    ? `${publicIdPrefix.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40)}-${Date.now()}`
    : undefined;

  const uploadOptions: Record<string, any> = {
    folder,
    resource_type: 'image',
  };

  if (cleanPublicId) {
    uploadOptions.public_id = cleanPublicId;
  }

  try {
    const result = await cloudinary.uploader.upload(fileData, uploadOptions);
    if (!result || !result.secure_url) {
      throw new Error('Cloudinary secure URL পাওয়া যায়নি');
    }
    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Cloudinary আপলোড ব্যর্থ হয়েছে: ${error.message || 'অজানা সমস্যা'}`);
  }
}

