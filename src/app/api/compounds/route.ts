import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import { generateSlug, validateSafeContent } from '@/lib/utils';

// GET all compounds or search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { chemical_class: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const compounds = await Compound.find(query)
      .populate('related_medicines')
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: compounds });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new compound (protected)
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
    const contentToValidate = `${body.description} ${body.mechanism_of_action} ${body.warnings}`;
    if (!validateSafeContent(contentToValidate)) {
      return NextResponse.json(
        { success: false, error: 'Content contains prohibited synthesis information' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(body.name);

    const compound = await Compound.create({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, data: compound }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
