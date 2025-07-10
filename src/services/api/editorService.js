import editorData from "@/services/mockData/editorData.json";

class EditorService {
  async validateFile(file) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!file) {
          reject(new Error("No file provided"));
          return;
        }
        
        if (!editorData.supportedFormats.includes(file.type)) {
          reject(new Error(`Unsupported file format. Supported formats: ${editorData.supportedFormats.join(", ")}`));
          return;
        }
        
        if (file.size > editorData.maxFileSize) {
          reject(new Error(`File too large. Maximum size: ${Math.round(editorData.maxFileSize / 1024 / 1024)}MB`));
          return;
        }
        
        resolve(true);
      }, 100);
    });
  }
  
  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      img.onload = () => {
        try {
          if (img.width > editorData.maxImageDimensions.width || img.height > editorData.maxImageDimensions.height) {
            reject(new Error(`Image too large. Maximum dimensions: ${editorData.maxImageDimensions.width}x${editorData.maxImageDimensions.height}`));
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const originalData = ctx.getImageData(0, 0, img.width, img.height);
          
          resolve({
            originalData: originalData,
            currentData: imageData,
            width: img.width,
            height: img.height,
            format: file.type
          });
        } catch (error) {
          reject(new Error("Failed to load image: " + error.message));
        }
      };
      
      img.onerror = () => {
        reject(new Error("Failed to load image file"));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  async exportImage(imageData, format, quality = 0.9) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          ctx.putImageData(imageData, 0, 0);
          
          const exportFormat = editorData.exportFormats.find(f => f.mimeType === format);
          if (!exportFormat) {
            reject(new Error("Unsupported export format"));
            return;
          }
          
          const qualityValue = exportFormat.quality ? quality : undefined;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({
                blob,
                url,
                filename: `edited-image.${exportFormat.extension}`
              });
            } else {
              reject(new Error("Failed to export image"));
            }
          }, format, qualityValue);
        } catch (error) {
          reject(new Error("Export failed: " + error.message));
        }
      }, 200);
    });
  }
  
  getExportFormats() {
    return editorData.exportFormats;
  }
  
  getQualitySettings() {
    return editorData.qualitySettings;
  }
  
  getCanvasSettings() {
    return editorData.canvasSettings;
  }
  
  getHistoryLimit() {
    return editorData.historyLimit;
  }
}

export default new EditorService();