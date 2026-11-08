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
 * Uploads an image buffer or base64 data URI to Cloudinary via REST API using Node's built-in crypto
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

  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Parameters to sign in alphabetical order
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp,
  };

  let cleanPublicId: string | undefined;
  if (publicIdPrefix) {
    cleanPublicId = `${publicIdPrefix.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40)}-${Date.now()}`;
    paramsToSign.public_id = cleanPublicId;
  }

  // Generate SHA-1 signature according to Cloudinary specification:
  // Sort alphabetically: key1=value1&key2=value2<api_secret>
  const sortedKeys = Object.keys(paramsToSign).sort();
  const stringToSign = sortedKeys.map((k) => `${k}=${paramsToSign[k]}`).join('&') + apiSecret;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  // Prepare file data URI
  let fileData: string;
  if (Buffer.isBuffer(fileInput)) {
    fileData = `data:image/jpeg;base64,${fileInput.toString('base64')}`;
  } else if (fileInput.startsWith('data:')) {
    fileData = fileInput;
  } else {
    fileData = `data:image/jpeg;base64,${fileInput}`;
  }

  // Payload for Cloudinary REST API
  const payload: Record<string, any> = {
    file: fileData,
    api_key: apiKey,
    timestamp,
    folder,
    signature,
  };

  if (cleanPublicId) {
    payload.public_id = cleanPublicId;
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorDetail = data?.error?.message || 'Cloudinary আপলোড ব্যর্থ হয়েছে';
    console.error('Cloudinary API error response:', data);
    throw new Error(`Cloudinary Error: ${errorDetail}`);
  }

  if (!data.secure_url) {
    throw new Error('Cloudinary secure URL পাওয়া যায়নি');
  }

  return data.secure_url;
}

