import { defaultProductsRepo } from '@/infrastructure/db/products-repo';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json(
        { error: 'Parámetro q obligatorio. Mínimo 2 caracteres.' },
        { status: 400 }
      );
    }

    const products = await defaultProductsRepo.searchByName(q, 20);

    const results = products.map((p) => ({
      barcode: p.barcode,
      name: p.name,
      brand: p.brand,
      status: p.status,
      hasMeat: p.hasMeat,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor en la búsqueda.' },
      { status: 500 }
    );
  }
}
