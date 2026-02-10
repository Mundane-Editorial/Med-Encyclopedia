import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';

// Global search endpoint
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search compounds
    const compounds = await Compound.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { chemical_class: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    // Search medicines
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand_names: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('compound')
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        compounds,
        medicines,
        total: compounds.length + medicines.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
