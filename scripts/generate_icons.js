import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height) {
  // RGBA buffer with gradient and rounded square
  const buffer = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Indigo gradient (#6366f1 to #3b82f6)
      const ratioY = y / height;
      const ratioX = x / width;
      const r = Math.round(99 * (1 - ratioY) + 59 * ratioY);
      const g = Math.round(102 * (1 - ratioX) + 130 * ratioX);
      const b = Math.round(241 * (1 - ratioY) + 246 * ratioY);
      
      // Simple corner rounding
      const cornerRadius = Math.max(2, Math.floor(width * 0.18));
      const distLeft = x;
      const distRight = width - 1 - x;
      const distTop = y;
      const distBottom = height - 1 - y;
      
      let inCorner = false;
      let cornerDist = 0;
      if (distLeft < cornerRadius && distTop < cornerRadius) {
        cornerDist = Math.hypot(cornerRadius - distLeft, cornerRadius - distTop);
        inCorner = true;
      } else if (distRight < cornerRadius && distTop < cornerRadius) {
        cornerDist = Math.hypot(cornerRadius - distRight, cornerRadius - distTop);
        inCorner = true;
      } else if (distLeft < cornerRadius && distBottom < cornerRadius) {
        cornerDist = Math.hypot(cornerRadius - distLeft, cornerRadius - distBottom);
        inCorner = true;
      } else if (distRight < cornerRadius && distBottom < cornerRadius) {
        cornerDist = Math.hypot(cornerRadius - distRight, cornerRadius - distBottom);
        inCorner = true;
      }
      
      if (inCorner && cornerDist > cornerRadius) {
        // Transparent outside rounded corner
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
      } else {
        // Center glyph indicator / white emblem in center
        const cx = width / 2;
        const cy = height / 2;
        const distFromCenter = Math.hypot(x - cx, y - cy);
        const radiusInner = width * 0.28;
        
        if (distFromCenter < radiusInner && distFromCenter > radiusInner * 0.6) {
          buffer[idx] = 255;
          buffer[idx + 1] = 255;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 240;
        } else if (y > cy - 2 && y < cy + 2 && x > cx - radiusInner && x < cx + radiusInner) {
          buffer[idx] = 255;
          buffer[idx + 1] = 255;
          buffer[idx + 2] = 255;
          buffer[idx + 3] = 255;
        } else {
          buffer[idx] = r;
          buffer[idx + 1] = g;
          buffer[idx + 2] = b;
          buffer[idx + 3] = 255;
        }
      }
    }
  }

  // Construct PNG file using standard chunks: IHDR, IDAT, IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0; // filter: none
    buffer.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  
  // CRC-32
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc >>> 0, 8 + length);
  return chunk;
}

// Basic CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const iconsDir = path.resolve(process.cwd(), 'extension/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const pngBuf = createPNG(size, size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), pngBuf);
  console.log(`Generated icon${size}.png (${size}x${size})`);
});
