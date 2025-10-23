import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const products = await Product.find(query).sort({ name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    await dbConnect();

    const body = await request.json();
    const { name, description, category, size, weight, material, minStock, price, currentStock } = body;

    if (!name || !description || !category || !size || !weight || !material || !minStock || !price || currentStock === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const product = new Product({
      name,
      description,
      category,
      size,
      weight: Number(weight),
      material,
      minStock: Number(minStock),
      price: Number(price),
      currentStock: Number(currentStock),
    });

    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
