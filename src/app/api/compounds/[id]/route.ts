import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Compound from "@/models/Compound";
import { generateSlug, validateSafeContent } from "@/lib/utils";

// GET single compound
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const compound = await Compound.findById(id).populate(
      "related_medicines",
    );

    if (!compound) {
      return NextResponse.json(
        { success: false, error: "Compound not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: compound });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT update compound (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate safe content
    const contentToValidate = `${body.description} ${body.mechanism_of_action} ${body.warnings}`;
    if (!validateSafeContent(contentToValidate)) {
      return NextResponse.json(
        {
          success: false,
          error: "Content contains prohibited synthesis information",
        },
        { status: 400 },
      );
    }

    // Update slug if name changed
    if (body.name) {
      body.slug = generateSlug(body.name);
    }

    const compound = await Compound.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!compound) {
      return NextResponse.json(
        { success: false, error: "Compound not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: compound });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE compound (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const compound = await Compound.findByIdAndDelete(id);

    if (!compound) {
      return NextResponse.json(
        { success: false, error: "Compound not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
