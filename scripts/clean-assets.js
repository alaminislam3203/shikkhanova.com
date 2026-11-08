const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Delete all .bat files
try {
  const files = fs.readdirSync(rootDir);
  files.forEach((file) => {
    if (file.toLowerCase().endsWith('.bat')) {
      try {
        fs.unlinkSync(path.join(rootDir, file));
        console.log(`Deleted ${file}`);
      } catch {}
    }
  });
} catch {}
