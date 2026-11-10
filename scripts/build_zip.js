import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function createZip() {
  const zip = new JSZip();
  const baseDir = path.resolve(process.cwd(), 'extension');
  const zipFolder = zip.folder('uyfox-news-chrome-extension');

  function addFolderToZip(dir, zipNode) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipNode.folder(file);
        addFolderToZip(fullPath, subFolder);
      } else {
        const data = fs.readFileSync(fullPath);
        zipNode.file(file, data);
      }
    }
  }

  addFolderToZip(baseDir, zipFolder);

  // Also include PRD.md, SPEC.md, README.md in root of zip package
  if (fs.existsSync('PRD.md')) {
    zipFolder.file('PRD.md', fs.readFileSync('PRD.md', 'utf-8'));
  }
  if (fs.existsSync('SPEC.md')) {
    zipFolder.file('SPEC.md', fs.readFileSync('SPEC.md', 'utf-8'));
  }

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync('uyfox-news-chrome-extension.zip', content);
  fs.writeFileSync('khwerler-chrome-extension.zip', content);
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  fs.writeFileSync('public/uyfox-news-chrome-extension.zip', content);
  console.log('Successfully created uyfox-news-chrome-extension.zip (' + content.length + ' bytes)');
}

createZip();
