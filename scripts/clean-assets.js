const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const imagesDir = path.join(publicDir, 'assets', 'images');
const avatarsDir = path.join(publicDir, 'uploads', 'avatars');

console.log('🧹 শিক্ষানোভা (SikkhaNova) - অ্যাসেট ক্লিনআপ ও সঠিক স্থানে স্থানান্তর...');

// 1. Ensure required target directories exist
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

// 2. Cut root logo.png -> move to public/logo.png & public/assets/images/logo.png
const rootLogo = path.join(rootDir, 'logo.png');
const targetLogo = path.join(publicDir, 'logo.png');
const targetAssetsLogo = path.join(imagesDir, 'logo.png');

if (fs.existsSync(rootLogo)) {
  fs.copyFileSync(rootLogo, targetLogo);
  fs.copyFileSync(rootLogo, targetAssetsLogo);
  try {
    fs.unlinkSync(rootLogo);
    console.log('✅ root থেকে logo.png কেটে সঠিকভাবে public/logo.png তে সরানো হয়েছে।');
  } catch {}
} else if (fs.existsSync(targetLogo)) {
  if (!fs.existsSync(targetAssetsLogo)) {
    fs.copyFileSync(targetLogo, targetAssetsLogo);
  }
}

// 3. Move/Ensure bkash.png and nagad.png are in public/assets/images/
const publicBkash = path.join(publicDir, 'bkash.png');
const publicNagad = path.join(publicDir, 'nagad.png');
const targetBkash = path.join(imagesDir, 'bkash.png');
const targetNagad = path.join(imagesDir, 'nagad.png');

if (!fs.existsSync(targetBkash) && fs.existsSync(publicBkash)) {
  fs.copyFileSync(publicBkash, targetBkash);
}
if (!fs.existsSync(targetNagad) && fs.existsSync(publicNagad)) {
  fs.copyFileSync(publicNagad, targetNagad);
}

// 4. Delete redundant duplicate files
const redundantFiles = [
  path.join(publicDir, 'bkash.png'),
  path.join(publicDir, 'nagad.png'),
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'app.js'),
];

redundantFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`🗑️ অপ্রয়োজনীয় ডুপ্লিকেট ফাইল মুছে ফেলা হয়েছে: ${path.basename(file)}`);
    } catch (e) {
      console.warn(`মুছতে ব্যর্থ: ${file}`, e.message);
    }
  }
});

// 5. Delete redundant empty directories
const redundantDirs = [
  path.join(publicDir, 'assets', 'logos'),
  path.join(publicDir, 'assets', 'icons'),
];

redundantDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`🗑️ অপ্রয়োজনীয় ডিরেক্টরি মুছে ফেলা হয়েছে: assets/${path.basename(dir)}`);
    } catch (e) {
      console.warn(`ডিরেক্টরি মুছতে ব্যর্থ: ${dir}`, e.message);
    }
  }
});

console.log('\n✨ সমস্ত অ্যাসেট নিখুঁতভাবে তাদের সঠিক স্থানে সাজানো হয়েছে!');
console.log('📁 লোগো: public/logo.png & public/assets/images/logo.png');
console.log('📁 পেমেন্ট আইকন: public/assets/images/bkash.png & public/assets/images/nagad.png');
console.log('📁 ইউজার অবতার: public/uploads/avatars/\n');

