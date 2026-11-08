import crypto from 'crypto';

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
 * Uploads an image buffer or base64 data URI to Cloudinary
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
    throw new Error('Cloudinary এনভায়রনমেন্ট ভেরিয়েবল (CLOUD_NAME, API_KEY, API_SECRET) পাওয়া যায়নি');
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Prepare parameters to sign
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp,
  };

  if (publicIdPrefix) {
    const cleanPrefix = publicIdPrefix.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40);
    paramsToSign.public_id = `${cleanPrefix}-${Date.now()}`;
  }

  // Sort keys alphabetically as required by Cloudinary signing specification
  const sortedKeys = Object.keys(paramsToSign).sort();
  const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  // Convert buffer to data URI if Buffer was passed
  let fileData: string;
  if (Buffer.isBuffer(fileInput)) {
    fileData = `data:image/jpeg;base64,${fileInput.toString('base64')}`;
  } else {
    fileData = fileInput;
  }

  const formData = new FormData();
  formData.append('file', fileData);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);
  if (paramsToSign.public_id) {
    formData.append('public_id', paramsToSign.public_id);
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const errorDetail = data?.error?.message || 'Cloudinary আপলোড ব্যর্থ হয়েছে';
    throw new Error(`Cloudinary Error: ${errorDetail}`);
  }

  return data.secure_url;
}

