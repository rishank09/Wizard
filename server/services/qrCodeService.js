import QRCode from 'qrcode';

export class QRCodeService {
  static async generateQRCode(text, options = {}) {
    const {
      size = 300,
      color = {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel = 'M'
    } = options;

    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Text is required and must be a string');
      }

      if (text.length > 2000) {
        throw new Error('Text too long. Maximum 2000 characters allowed.');
      }

      const qrOptions = {
        width: size,
        color: color,
        errorCorrectionLevel: errorCorrectionLevel,
        type: 'image/png',
        quality: 0.92,
        margin: 1
      };

      const qrCodeDataUrl = await QRCode.toDataURL(text, qrOptions);
      
      return {
        qrCodeImage: qrCodeDataUrl,
        size: size,
        text: text
      };
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  static validateColor(color) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  static validateSize(size) {
    const num = parseInt(size);
    return !isNaN(num) && num >= 100 && num <= 1000;
  }
}
