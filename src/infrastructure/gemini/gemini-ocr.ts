/**
 * Gemini Vision OCR stub.
 *
 * Extracts ingredient text from a base64 image using Google Generative AI (Gemini Flash).
 * The real implementation requires `GOOGLE_API_KEY` env var.
 * This module is designed to be easily stubbed in tests.
 */

export async function extractIngredients(imageBase64: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY not configured');
  }

  // Strip data URL prefix if present
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    },
    {
      text:
        'Extrae SOLO la lista de ingredientes de esta foto de un producto alimentario. ' +
        'Devuelve únicamente el texto de ingredientes, sin formato, sin explicación.',
    },
  ]);

  const response = result.response;
  const text = response.text();

  return text.trim();
}
