const fs = require('fs');
const path = require('path');

// Auto-sync assets into public root and public/assets/
const publicDir = path.join(__dirname, 'public');
const rootLogo = path.join(__dirname, 'logo.png');
const publicLogo = path.join(publicDir, 'logo.png');
const assetsLogoDir = path.join(publicDir, 'assets', 'logos');
const assetsLogo = path.join(assetsLogoDir, 'logo.png');

try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Sync logo.png
  if (fs.existsSync(rootLogo)) {
    if (!fs.existsSync(assetsLogoDir)) {
      fs.mkdirSync(assetsLogoDir, { recursive: true });
    }
    fs.copyFileSync(rootLogo, publicLogo);
    fs.copyFileSync(rootLogo, assetsLogo);
    console.log('✅ Logo synced successfully to public/ and public/assets/logos/');
  }

  // 2. Sync bkash.png and nagad.png to /public root and /public/assets/icons
  const bkashImg = path.join(publicDir, 'assets', 'images', 'bkash.png');
  const nagadImg = path.join(publicDir, 'assets', 'images', 'nagad.png');
  const iconsDir = path.join(publicDir, 'assets', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  if (fs.existsSync(bkashImg)) {
    fs.copyFileSync(bkashImg, path.join(publicDir, 'bkash.png'));
    fs.copyFileSync(bkashImg, path.join(iconsDir, 'bkash.png'));
  }
  if (fs.existsSync(nagadImg)) {
    fs.copyFileSync(nagadImg, path.join(publicDir, 'nagad.png'));
    fs.copyFileSync(nagadImg, path.join(iconsDir, 'nagad.png'));
  }
  console.log('✅ bKash and Nagad icons synced to public root & assets/icons/');
} catch (err) {
  console.error('Error syncing assets:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
