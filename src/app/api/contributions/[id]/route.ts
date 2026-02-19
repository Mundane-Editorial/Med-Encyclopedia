import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Contribution from "@/models/Contribution";
import Compound from "@/models/Compound";
import Medicine from "@/models/Medicine";
import { validateSafeContent, generateSlug } from "@/lib/utils";
import ApprovedAdmin from "@/models/ApprovedAdmin";

// GET single contribution
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const contribution = await Contribution.findById(id).lean();

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: "Contribution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(contribution)),
    });
  } catch (error: any) {
    console.error("Error fetching contribution:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contribution" },
      { status: 500 },
    );
  }
}

// PUT - Update contribution (approve/reject) - Admin only
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { status, adminNotes, acceptedBy } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    await connectDB();

    const contribution = await Contribution.findById(id);

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: "Contribution not found" },
        { status: 404 },
      );
    }

    // Update basic info
    contribution.status = status;

    if (adminNotes) {
      contribution.adminNotes = adminNotes;
    }

    const adminMatch = await ApprovedAdmin.findOne({
      name: acceptedBy.name.trim(),
    });

    if (!adminMatch) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin name" },
        { status: 403 },
      );
    }

    // Save admin
    contribution.acceptedBy = {
      adminId: null,
      name: acceptedBy.name.trim(),
    };

    // ---------------------------------------------
    //   Your existing APPROVED handling logic
    // ---------------------------------------------
    if (status === "approved") {
      if (contribution.type === "compound") {
        const existingCompound = await Compound.findOne({
          name: { $regex: new RegExp(`^${contribution.title}$`, "i") },
        });

        if (existingCompound) {
          existingCompound.description = contribution.description;
          await existingCompound.save();
        } else {
          const slug = generateSlug(contribution.title);
          await Compound.create({
            name: contribution.title,
            description: contribution.description,
            chemical_class: "Unknown",
            mechanism_of_action: contribution.description,
            slug,
          });
        }
      } else if (contribution.type === "medicine") {
        const existingMedicine = await Medicine.findOne({
          name: { $regex: new RegExp(`^${contribution.title}$`, "i") },
        });

        if (existingMedicine) {
          existingMedicine.description = contribution.description;
          await existingMedicine.save();
        } else {
          const defaultCompound = await Compound.findOne();
          if (defaultCompound) {
            const slug = generateSlug(contribution.title);
            await Medicine.create({
              name: contribution.title,
              description: contribution.description,
              compound: defaultCompound._id,
              general_usage_info: contribution.description,
              safety_info: "Please consult a healthcare professional.",
              slug,
            });
          }
        }
      } else if (contribution.type === "correction" && contribution.relatedId) {
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
    console.error("Error updating contribution:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contribution" },
      { status: 500 },
    );
  }
}

// DELETE - Admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const contribution = await Contribution.findByIdAndDelete(id);

    if (!contribution) {
      return NextResponse.json(
        { success: false, message: "Contribution not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contribution deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting contribution:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete contribution" },
      { status: 500 },
    );
  }
}
