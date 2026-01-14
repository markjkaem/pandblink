import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'public', 'examples');

// Ensure output directory exists
await mkdir(outputDir, { recursive: true });

const examples = [
  { name: 'woonkamer', titleNL: 'Woonkamer', colorBefore: '#4a5568', colorAfter: '#f6ad55' },
  { name: 'keuken', titleNL: 'Keuken', colorBefore: '#553c2f', colorAfter: '#faf089' },
  { name: 'slaapkamer', titleNL: 'Slaapkamer', colorBefore: '#2d3748', colorAfter: '#90cdf4' },
  { name: 'badkamer', titleNL: 'Badkamer', colorBefore: '#5f6c5c', colorAfter: '#9ae6b4' },
  { name: 'tuin', titleNL: 'Tuin', colorBefore: '#4a5568', colorAfter: '#68d391' },
  { name: 'exterieur', titleNL: 'Exterieur', colorBefore: '#3d4852', colorAfter: '#fbb6ce' },
];

const width = 800;
const height = 600;

async function createImage(filename, bgColor, text, isAfter) {
  const overlayColor = isAfter ? 'rgba(251, 146, 60, 0.3)' : 'rgba(0, 0, 0, 0.4)';
  const label = isAfter ? 'NA - Verbeterd' : 'VOOR - Origineel';
  const textColor = isAfter ? '#f97316' : '#94a3b8';

  // Create SVG with gradient background and text
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${isAfter ? '#ffffff' : '#1a1a2e'};stop-opacity:0.3" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${isAfter ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}" stroke-width="1"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>

      <!-- Simulated room elements -->
      <rect x="50" y="350" width="700" height="200" fill="${isAfter ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}" rx="5"/>
      <rect x="100" y="100" width="200" height="150" fill="${isAfter ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}" rx="10"/>
      <rect x="500" y="80" width="180" height="200" fill="${isAfter ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)'}" rx="8"/>
      <circle cx="650" cy="450" r="60" fill="${isAfter ? 'rgba(251,146,60,0.3)' : 'rgba(100,100,100,0.2)'}"/>

      <!-- Light effect for "after" images -->
      ${isAfter ? `
        <ellipse cx="400" cy="50" rx="300" ry="100" fill="rgba(255,255,255,0.15)"/>
        <circle cx="150" cy="150" r="80" fill="rgba(251,191,36,0.1)"/>
      ` : ''}

      <!-- Room name -->
      <text x="400" y="300" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${textColor}" text-anchor="middle">${text}</text>

      <!-- Label badge -->
      <rect x="${isAfter ? 620 : 20}" y="20" width="160" height="40" rx="8" fill="${isAfter ? '#f97316' : '#334155'}"/>
      <text x="${isAfter ? 700 : 100}" y="47" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${label}</text>

      <!-- Pandblink watermark -->
      <text x="400" y="570" font-family="Arial, sans-serif" font-size="14" fill="${isAfter ? 'rgba(249,115,22,0.6)' : 'rgba(148,163,184,0.5)'}" text-anchor="middle">pandblink.nl</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 85 })
    .toFile(join(outputDir, filename));

  console.log(`Created: ${filename}`);
}

console.log('Generating example images...\n');

for (const example of examples) {
  await createImage(
    `${example.name}-voor.jpg`,
    example.colorBefore,
    example.titleNL,
    false
  );
  await createImage(
    `${example.name}-na.jpg`,
    example.colorAfter,
    example.titleNL,
    true
  );
}

console.log('\nDone! All example images generated in /public/examples/');
