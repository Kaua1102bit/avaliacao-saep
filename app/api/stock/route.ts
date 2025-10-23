import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import StockMovement from '@/models/StockMovement';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();
    await dbConnect();

    const products = await Product.find().sort({ name: 1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Get stock products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await dbConnect();

    const body = await request.json();
    const { productId, type, quantity, date, notes } = body;

    if (!productId || !type || !quantity || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!['entrada', 'saida'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid movement type' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const quantityNum = Number(quantity);
    let newStock = product.currentStock;

    if (type === 'entrada') {
      newStock += quantityNum;
    } else {
      newStock -= quantityNum;
      if (newStock < 0) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
    }

    // Update product stock
    product.currentStock = newStock;
    await product.save();

    // Create stock movement record
    const movement = new StockMovement({
      product: productId,
      type,
      quantity: quantityNum,
      date: new Date(date),
      responsible: user.userId,
      notes: notes || '',
    });

    await movement.save();

    // Check for minimum stock alert
    let alert = null;
    if (type === 'saida' && newStock <= product.minStock) {
      alert = `Stock alert: ${product.name} is at or below minimum stock level (${newStock}/${product.minStock})`;
    }

    return NextResponse.json({
      product,
      movement,
      alert,
    });
  } catch (error) {
    console.error('Stock movement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
