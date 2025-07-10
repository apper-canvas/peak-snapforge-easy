// Image processing utilities
export class ImageProcessor {
  static applyAdjustments(imageData, adjustments) {
    const { data } = imageData;
    const { brightness, contrast, saturation, hue } = adjustments;
    
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Apply brightness
      r = Math.max(0, Math.min(255, r + brightness));
      g = Math.max(0, Math.min(255, g + brightness));
      b = Math.max(0, Math.min(255, b + brightness));
      
      // Apply contrast
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128));
      g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128));
      b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128));
      
      // Apply saturation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = Math.max(0, Math.min(255, gray + saturation * (r - gray)));
      g = Math.max(0, Math.min(255, gray + saturation * (g - gray)));
      b = Math.max(0, Math.min(255, gray + saturation * (b - gray)));
      
      // Apply hue shift (simplified)
      if (hue !== 0) {
        const [h, s, v] = this.rgbToHsv(r, g, b);
        const newHue = (h + hue) % 360;
        const [newR, newG, newB] = this.hsvToRgb(newHue, s, v);
        r = newR;
        g = newG;
        b = newB;
      }
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    
    return imageData;
  }
  
  static applyFilter(imageData, filter) {
    const { data } = imageData;
    const { matrix, intensity } = filter;
    
    if (!matrix || matrix.length !== 9) return imageData;
    
    const tempData = new Uint8ClampedArray(data);
    const width = imageData.width;
    const height = imageData.height;
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        
        let r = 0, g = 0, b = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIdx = ((y + ky) * width + (x + kx)) * 4;
            const matrixIdx = (ky + 1) * 3 + (kx + 1);
            
            r += tempData[pixelIdx] * matrix[matrixIdx];
            g += tempData[pixelIdx + 1] * matrix[matrixIdx];
            b += tempData[pixelIdx + 2] * matrix[matrixIdx];
          }
        }
        
        // Apply intensity
        const originalR = tempData[idx];
        const originalG = tempData[idx + 1];
        const originalB = tempData[idx + 2];
        
        data[idx] = Math.max(0, Math.min(255, originalR + (r - originalR) * intensity));
        data[idx + 1] = Math.max(0, Math.min(255, originalG + (g - originalG) * intensity));
        data[idx + 2] = Math.max(0, Math.min(255, originalB + (b - originalB) * intensity));
      }
    }
    
    return imageData;
  }
  
  static rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    const s = max === 0 ? 0 : delta / max;
    const v = max;
    
    if (delta !== 0) {
      switch (max) {
        case r: h = ((g - b) / delta) % 6; break;
        case g: h = (b - r) / delta + 2; break;
        case b: h = (r - g) / delta + 4; break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }
    
    return [h, s, v];
  }
  
  static hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    
    let r, g, b;
    
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }
  
  static cropImage(imageData, cropRect) {
    const { x, y, width, height } = cropRect;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = width;
    canvas.height = height;
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, x, y, width, height, 0, 0, width, height);
    
    return ctx.getImageData(0, 0, width, height);
  }
  
  static rotateImage(imageData, angle) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    const { width, height } = imageData;
    
    if (angle === 90 || angle === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    tempCtx.putImageData(imageData, 0, 0);
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-width / 2, -height / 2);
    ctx.drawImage(tempCanvas, 0, 0);
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  static flipImage(imageData, horizontal = false) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    
    tempCtx.putImageData(imageData, 0, 0);
    
    if (horizontal) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.translate(0, -canvas.height);
    }
    
    ctx.drawImage(tempCanvas, 0, 0);
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  static createThumbnail(imageData, maxSize = 100) {
    const { width, height } = imageData;
    const scale = Math.min(maxSize / width, maxSize / height);
    
    const thumbWidth = Math.round(width * scale);
    const thumbHeight = Math.round(height * scale);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = thumbWidth;
    canvas.height = thumbHeight;
    
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, thumbWidth, thumbHeight);
    
    return ctx.getImageData(0, 0, thumbWidth, thumbHeight);
  }
}

export const defaultAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 1,
  hue: 0
};

export const presetFilters = [
  {
    name: "Original",
    matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    intensity: 1
  },
  {
    name: "Vintage",
    matrix: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
    intensity: 0.8
  },
  {
    name: "Sepia",
    matrix: [0.393, 0.769, 0.189, 0.349, 0.686, 0.168, 0.272, 0.534, 0.131],
    intensity: 1
  },
  {
    name: "Noir",
    matrix: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
    intensity: 1
  },
  {
    name: "Vivid",
    matrix: [1.2, 0, 0, 0, 1.2, 0, 0, 0, 1.2],
    intensity: 0.7
  },
  {
    name: "Cool",
    matrix: [0.8, 0, 0.2, 0, 1, 0, 0.2, 0, 0.8],
    intensity: 0.6
  },
  {
    name: "Warm",
    matrix: [1.1, 0.1, 0, 0.1, 1, 0, 0, 0, 0.9],
    intensity: 0.6
  },
  {
    name: "Sharpen",
    matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    intensity: 0.3
  },
  {
    name: "Blur",
    matrix: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9],
    intensity: 1
  },
  {
    name: "Edge",
    matrix: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    intensity: 0.5
  }
];

export const aspectRatios = [
  { name: "Free", ratio: null },
  { name: "1:1", ratio: 1 },
  { name: "4:3", ratio: 4/3 },
  { name: "16:9", ratio: 16/9 },
  { name: "3:2", ratio: 3/2 },
  { name: "9:16", ratio: 9/16 }
];