import { scanBarcode } from '@/application/scan-barcode';
import { NextResponse } from 'next/server';

const BARCODE_REGEX = /^\d{8,14}$/;

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode')?.trim();

    if (!barcode || !BARCODE_REGEX.test(barcode)) {
      return NextResponse.json(
        { error: 'Parámetro barcode inválido. Debe ser entre 8 y 14 dígitos numéricos.' },
        { status: 400 }
      );
    }

    const result = await scanBarcode(barcode);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el escaneo.' },
      { status: 500 }
    );
  }
}
