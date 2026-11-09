import crypto from 'crypto';

/**
 * Extracts Google Drive File ID from any Google Drive sharing / view / download link
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/ or /d/FILE_ID/
  const matchD = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]{15,})/);
  if (matchD && matchD[1]) {
    return matchD[1];
  }

  // Pattern 2: ?id=FILE_ID or &id=FILE_ID
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{15,})/);
  if (matchId && matchId[1]) {
    return matchId[1];
  }

  return null;
}

/**
 * Converts any Google Drive URL into a direct download link
 */
export function toGoogleDriveDownloadUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Converts any Google Drive URL into a clean view/preview link
 */
export function toGoogleDriveViewUrl(url: string): string {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Checks whether Google Drive API automatic upload credentials are set in .env
 */
export function isGoogleDriveConfigured(): boolean {
  const hasOAuth = Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_ID &&
      process.env.GOOGLE_DRIVE_CLIENT_SECRET &&
      process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  );

  const hasServiceAccount = Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_EMAIL && process.env.GOOGLE_DRIVE_PRIVATE_KEY
  );

  return hasOAuth || hasServiceAccount;
}

/**
 * Obtains a Google Drive API Access Token using either OAuth2 Refresh Token or Service Account JWT
 */
async function getGoogleDriveAccessToken(): Promise<string> {
  // 1. OAuth2 Refresh Token flow (Personal Gmail / Google Drive)
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN?.trim();

  if (clientId && clientSecret && refreshToken) {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      if (
        tokenData?.error === 'unauthorized_client' ||
        tokenData?.error_description === 'Unauthorized'
      ) {
        throw new Error(
          'Google Drive OAuth Unauthorized: OAuth Playground-এ প্রথমে ⚙️ Settings থেকে "Use your own OAuth credentials" টিক দিয়ে Client ID ও Secret বসিয়ে তারপর নতুন করে "Authorize APIs" ক্লিক করে নতুন Refresh Token নিন।'
        );
      }
      throw new Error(
        tokenData?.error_description ||
          tokenData?.error ||
          'Google Drive OAuth টোকেন তৈরি করা যায়নি'
      );
    }
    return tokenData.access_token;
  }

  // 2. Service Account JWT flow
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKey = (process.env.GOOGLE_DRIVE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Drive ক্রেডেনশিয়াল (.env) কনফিগার করা নেই');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString(
    'base64url'
  );
  const claimSet = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/drive.file',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  ).toString('base64url');

  const signatureInput = `${header}.${claimSet}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data?.error_description || 'Google Drive Service Account টোকেন ব্যর্থ হয়েছে');
  }

  return data.access_token;
}

/**
 * Uploads a PDF Buffer directly to Google Drive Folder & makes it publicly downloadable via link
 */
export async function uploadPdfToGoogleDrive(
  buffer: Buffer,
  fileName: string
): Promise<{ fileId: string; downloadUrl: string; viewUrl: string }> {
  const accessToken = await getGoogleDriveAccessToken();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();
  const cleanName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  const tryMultipartUpload = async (targetFolderId?: string) => {
    const metadata: Record<string, any> = {
      name: cleanName,
      mimeType: 'application/pdf',
    };
    if (targetFolderId) {
      metadata.parents = [targetFolderId];
    }

    const boundary = `-------shikkhanova_drive_${Date.now()}`;
    const metaPart = Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
        metadata
      )}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`,
      'utf-8'
    );
    const endPart = Buffer.from(`\r\n--${boundary}--`, 'utf-8');
    const multipartBody = Buffer.concat([metaPart, buffer, endPart]);

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      }
    );
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  };

  // First try with GOOGLE_DRIVE_FOLDER_ID; if scope is drive.file (which can't see manual folders), retry in root Drive
  let result = await tryMultipartUpload(folderId);
  if (!result.ok && folderId && (result.status === 404 || result.status === 403)) {
    result = await tryMultipartUpload(undefined);
  }

  if (!result.ok || !result.data?.id) {
    throw new Error(
      result.data?.error?.message || 'Google Drive-এ পিডিএফ আপলোড ব্যর্থ হয়েছে'
    );
  }

  const fileId = result.data.id as string;

  // Set file permission to "anyone with link can read" so approved students can download
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: 'reader',
      type: 'anyone',
    }),
  }).catch(() => {});

  return {
    fileId,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
  };
}

