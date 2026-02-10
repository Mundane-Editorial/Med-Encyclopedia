import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import Compound from '@/models/Compound';
import { generateSlug, validateSafeContent } from '@/lib/utils';

// GET all medicines or search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const compoundId = searchParams.get('compound');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (compoundId) {
      query.compound = compoundId;
    }

    const medicines = await Medicine.find(query)
      .populate('compound')
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: medicines });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new medicine (protected)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate safe content
    const contentToValidate = `${body.description} ${body.general_usage_info} ${body.general_dosage_info} ${body.safety_info}`;
    if (!validateSafeContent(contentToValidate)) {
      return NextResponse.json(
        { success: false, error: 'Content contains prohibited synthesis information' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(body.name);

    const medicine = await Medicine.create({
      ...body,
      slug,
    });

    // Update compound's related medicines
    await Compound.findByIdAndUpdate(body.compound, {
      $addToSet: { related_medicines: medicine._id },
    });

    return NextResponse.json({ success: true, data: medicine }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
