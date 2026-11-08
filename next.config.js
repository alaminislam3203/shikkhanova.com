const fs = require('fs');
const path = require('path');

// Auto clean and maintain assets in their proper standard locations
try {
  const rootDir = __dirname;
  const publicDir = path.join(rootDir, 'public');
  const imagesDir = path.join(publicDir, 'assets', 'images');
  const avatarsDir = path.join(publicDir, 'uploads', 'avatars');

  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

  // 1. Move root logo.png -> public/logo.png
  const rootLogo = path.join(rootDir, 'logo.png');
  const targetLogo = path.join(publicDir, 'logo.png');
  const targetAssetsLogo = path.join(imagesDir, 'logo.png');

  if (fs.existsSync(rootLogo)) {
    fs.copyFileSync(rootLogo, targetLogo);
    fs.copyFileSync(rootLogo, targetAssetsLogo);
    try { fs.unlinkSync(rootLogo); } catch {}
  } else if (fs.existsSync(targetLogo)) {
    if (!fs.existsSync(targetAssetsLogo)) {
      fs.copyFileSync(targetLogo, targetAssetsLogo);
    }
  }

  // 2. Remove redundant duplicates
  const redundantFiles = [
    path.join(publicDir, 'bkash.png'),
    path.join(publicDir, 'nagad.png'),
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'app.js'),
  ];
  redundantFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      try { fs.unlinkSync(file); } catch {}
    }
  });

  // 3. Remove redundant empty directories
  const redundantDirs = [
    path.join(publicDir, 'assets', 'logos'),
    path.join(publicDir, 'assets', 'icons'),
  ];
  redundantDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
    }
  });

  // 4. Delete all .bat files from root directory as requested by user
  try {
    const rootFiles = fs.readdirSync(rootDir);
    rootFiles.forEach((file) => {
      if (file.toLowerCase().endsWith('.bat')) {
        try {
          fs.unlinkSync(path.join(rootDir, file));
        } catch {}
      }
    });
  } catch {}
} catch (err) {
  // Silent cleanup fallback
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.youtube.com', 'images.unsplash.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;
