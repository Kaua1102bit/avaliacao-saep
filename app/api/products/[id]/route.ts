import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    await dbConnect();

    const { id } = await params;
    console.log('Updating product with id:', id);

    const body = await request.json();
    const { name, description, category, size, weight, material, minStock, price, currentStock } = body;

    if (!name || !description || !category || !size || !weight || !material || !minStock || !price || currentStock === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        size,
        weight: Number(weight),
        material,
        minStock: Number(minStock),
        price: Number(price),
        currentStock: Number(currentStock),
      },
      { new: true }
    );

    if (!product) {
      console.log('Product not found for id:', id);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    await dbConnect();

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
