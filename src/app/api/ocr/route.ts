import { classify } from '@/domain/classification';
import { NextResponse } from 'next/server';

const MAX_PAYLOAD_SIZE = 500_000; // 500KB base64 limit

export async function POST(request: Request): Promise<Response> {
  // Pre-flight: Check GOOGLE_API_KEY availability
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: 'Servicio OCR no disponible. API key no configurada.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'Campo imageBase64 obligatorio.' },
        { status: 400 }
      );
    }

    if (imageBase64.length > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Imagen demasiado grande. Máximo 500KB en base64.' },
        { status: 413 }
      );
    }

    const { extractIngredients } = await import(
      '@/infrastructure/gemini/gemini-ocr'
    );
    const ingredientsText = await extractIngredients(imageBase64);

    const classification = classify(ingredientsText);

    return NextResponse.json({
      found: true,
      name: 'Ingredientes escaneados (OCR)',
      ingredients: ingredientsText,
      ingredientsText,
      status: classification.status,
      hasMeat: classification.hasMeat,
      conflicts: classification.conflicts,
      explanation: classification.explanation,
    });
  } catch {
    return NextResponse.json(
      { error: 'Error procesando la imagen con OCR.' },
      { status: 500 }
    );
  }
}
