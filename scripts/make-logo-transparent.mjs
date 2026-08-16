import path from "node:path";
import sharp from "sharp";

const SOURCE = path.join(process.cwd(), "public", "logo.jpeg");
const TARGET = path.join(process.cwd(), "public", "logo.png");

// Pixels lighter than this (per-channel minimum) can belong to the background.
const WHITE_FLOOR = 220;
// The JPEG's "white" is not a clean 255, so anything above this counts as fully background.
const WHITE_CEILING = 248;

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const background = new Uint8Array(width * height);
const queue = [];

function minChannel(index) {
  const offset = index * channels;
  return Math.min(data[offset], data[offset + 1], data[offset + 2]);
}

function seed(x, y) {
  const index = y * width + x;
  if (!background[index] && minChannel(index) >= WHITE_FLOOR) {
    background[index] = 1;
    queue.push(index);
  }
}

for (let x = 0; x < width; x += 1) {
  seed(x, 0);
  seed(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  seed(0, y);
  seed(width - 1, y);
}

// Flood fill inwards so white areas enclosed by the artwork stay opaque.
while (queue.length) {
  const index = queue.pop();
  const x = index % width;
  const y = (index - x) / width;

  if (x > 0) seed(x - 1, y);
  if (x < width - 1) seed(x + 1, y);
  if (y > 0) seed(x, y - 1);
  if (y < height - 1) seed(x, y + 1);
}

for (let index = 0; index < width * height; index += 1) {
  if (!background[index]) continue;

  const offset = index * channels;
  const value = minChannel(index);
  // Ramp the alpha so anti-aliased edges fade out instead of leaving a halo.
  const alpha = Math.max(
    0,
    Math.min(255, Math.round(((WHITE_CEILING - value) / (WHITE_CEILING - WHITE_FLOOR)) * 255))
  );

  data[offset + 3] = alpha;

  if (alpha > 0) {
    // Undo the white the JPEG blended into the edge pixels.
    const ratio = alpha / 255;
    for (let channel = 0; channel < 3; channel += 1) {
      const unmixed = (data[offset + channel] - 255 * (1 - ratio)) / ratio;
      data[offset + channel] = Math.max(0, Math.min(255, Math.round(unmixed)));
    }
  }
}

let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (data[(y * width + x) * channels + 3] === 0) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

// The source artwork carries tagline lines under the wordmark. They live in their own
// bands separated by empty rows, so cut at the first wide gap in the lower part.
const GAP_ROWS = 6;
const GAP_SEARCH_START = 0.6;

const boxTop = minY;
const boxHeight = maxY - minY + 1;
let contentHeight = boxHeight;
let emptyRun = 0;

for (let y = boxTop; y <= maxY; y += 1) {
  let opaque = false;
  for (let x = minX; x <= maxX; x += 1) {
    if (data[(y * width + x) * channels + 3] > 10) {
      opaque = true;
      break;
    }
  }

  if (opaque) {
    emptyRun = 0;
    continue;
  }

  emptyRun += 1;
  const runStart = y - emptyRun + 1;

  if (emptyRun >= GAP_ROWS && runStart - boxTop >= boxHeight * GAP_SEARCH_START) {
    contentHeight = runStart - boxTop;
    break;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: contentHeight,
  })
  .resize({ width: 640, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(TARGET);

const output = await sharp(TARGET).metadata();
console.log(`logo.png written: ${output.width}x${output.height}`);
