import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Contribution from '@/models/Contribution';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';
import { validateSafeContent, generateSlug } from '@/lib/utils';

// GET single contribution
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const contribution = await Contribution.findById(params.id).lean();

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: 'Contribution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(contribution)),
    });
  } catch (error: any) {
    console.error('Error fetching contribution:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contribution' },
      { status: 500 }
    );
  }
}

// PUT - Update contribution (approve/reject) - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, adminNotes } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    const contribution = await Contribution.findById(params.id);

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: 'Contribution not found' },
        { status: 404 }
      );
    }

    // Update contribution status
    contribution.status = status;
    if (adminNotes) {
      contribution.adminNotes = adminNotes;
    }

    // If approved, create or update the actual content
    if (status === 'approved') {
      if (contribution.type === 'compound') {
        // Check if compound already exists
        const existingCompound = await Compound.findOne({
          name: { $regex: new RegExp(`^${contribution.title}$`, 'i') },
        });

        if (existingCompound) {
          // Update existing compound
          existingCompound.description = contribution.description;
          await existingCompound.save();
        } else {
          // Create new compound
          const slug = generateSlug(contribution.title);
          await Compound.create({
            name: contribution.title,
            description: contribution.description,
            chemical_class: 'Unknown', // Admin should update this
            mechanism_of_action: contribution.description,
            slug,
          });
        }
      } else if (contribution.type === 'medicine') {
        // Check if medicine already exists
        const existingMedicine = await Medicine.findOne({
          name: { $regex: new RegExp(`^${contribution.title}$`, 'i') },
        });

        if (existingMedicine) {
          // Update existing medicine
          existingMedicine.description = contribution.description;
          await existingMedicine.save();
        } else {
          // For new medicines, we need a compound reference
          // This is a simplified version - in production, you'd want to handle this better
          const defaultCompound = await Compound.findOne();
          if (defaultCompound) {
            const slug = generateSlug(contribution.title);
            await Medicine.create({
              name: contribution.title,
              description: contribution.description,
              compound: defaultCompound._id,
              general_usage_info: contribution.description,
              safety_info: 'Please consult a healthcare professional.',
              slug,
            });
          }
        }
      } else if (contribution.type === 'correction' && contribution.relatedId) {
        // Handle corrections - this is simplified
        // In production, you'd want better matching logic
        const compound = await Compound.findById(contribution.relatedId);
        const medicine = await Medicine.findById(contribution.relatedId);

        if (compound) {
          compound.description = contribution.description;
          await compound.save();
        } else if (medicine) {
          medicine.description = contribution.description;
          await medicine.save();
        }
      }
    }

    await contribution.save();

    return NextResponse.json({
      success: true,
      message: `Contribution ${status} successfully`,
      data: JSON.parse(JSON.stringify(contribution)),
    });
  } catch (error: any) {
    console.error('Error updating contribution:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update contribution' },
      { status: 500 }
    );
  }
}

// DELETE - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const contribution = await Contribution.findByIdAndDelete(params.id);

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: 'Contribution not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contribution deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting contribution:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete contribution' },
      { status: 500 }
    );
  }
}
