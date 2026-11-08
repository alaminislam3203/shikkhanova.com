const fs = require('fs');
const path = require('path');

// Auto-copy root logo.png into public/ and public/assets/logos/ on startup
const rootLogo = path.join(__dirname, 'logo.png');
const publicDir = path.join(__dirname, 'public');
const publicLogo = path.join(publicDir, 'logo.png');
const assetsLogoDir = path.join(publicDir, 'assets', 'logos');
const assetsLogo = path.join(assetsLogoDir, 'logo.png');

if (fs.existsSync(rootLogo)) {
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    if (!fs.existsSync(assetsLogoDir)) {
      fs.mkdirSync(assetsLogoDir, { recursive: true });
    }
    fs.copyFileSync(rootLogo, publicLogo);
    fs.copyFileSync(rootLogo, assetsLogo);
    console.log('✅ Logo synced successfully to public/ and public/assets/logos/');
  } catch (err) {
    console.error('Error copying logo asset:', err);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
