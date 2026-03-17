import sql from "../configs/db.js";
import { QRCodeService } from "../services/qrCodeService.js";

export const generateQRCode = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { text, size, color } = req.body;
    const plan = req.plan;

    if (!text) {
      return res.json({
        success: false,
        message: "Text is required to generate QR code",
      });
    }

    const options = {};
    
    if (size && QRCodeService.validateSize(size)) {
      options.size = parseInt(size);
    }

    if (color) {
      const colorOptions = {};
      if (color.dark && QRCodeService.validateColor(color.dark)) {
        colorOptions.dark = color.dark;
      }
      if (color.light && QRCodeService.validateColor(color.light)) {
        colorOptions.light = color.light;
      }
      if (Object.keys(colorOptions).length > 0) {
        options.color = colorOptions;
      }
    }

    const result = await QRCodeService.generateQRCode(text, options);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${text}, ${result.qrCodeImage}, 'qr-code')
    `;

    res.json({ 
      success: true, 
      ...result
    });

  } catch (error) {
    console.error(error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
};
