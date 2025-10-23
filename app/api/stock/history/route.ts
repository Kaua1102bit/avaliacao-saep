import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StockMovement from '@/models/StockMovement';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    let query = {};
    if (productId) {
      query = { product: productId };
    }

    const movements = await StockMovement.find(query)
      .populate('product', 'name category')
      .populate('responsible', 'name username')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await StockMovement.countDocuments(query);

    return NextResponse.json({
      movements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get stock history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
