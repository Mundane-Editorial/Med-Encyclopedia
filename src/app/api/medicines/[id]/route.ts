import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Medicine from '@/models/Medicine';
import Compound from '@/models/Compound';
import { generateSlug, validateSafeContent } from '@/lib/utils';

// GET single medicine
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const medicine = await Medicine.findById(params.id).populate('compound');

    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: medicine });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update medicine (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update slug if name changed
    if (body.name) {
      body.slug = generateSlug(body.name);
    }

    const oldMedicine = await Medicine.findById(params.id);
    
    const medicine = await Medicine.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // If compound changed, update relationships
    if (oldMedicine && body.compound && oldMedicine.compound.toString() !== body.compound) {
      await Compound.findByIdAndUpdate(oldMedicine.compound, {
        $pull: { related_medicines: medicine._id },
      });
      await Compound.findByIdAndUpdate(body.compound, {
        $addToSet: { related_medicines: medicine._id },
      });
    }

    return NextResponse.json({ success: true, data: medicine });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE medicine (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const medicine = await Medicine.findById(params.id);

    if (!medicine) {
      return NextResponse.json(
        { success: false, error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Remove from compound's related medicines
    await Compound.findByIdAndUpdate(medicine.compound, {
      $pull: { related_medicines: medicine._id },
    });

    await Medicine.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
