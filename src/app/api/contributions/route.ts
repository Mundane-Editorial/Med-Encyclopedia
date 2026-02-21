import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contribution from "@/models/Contribution";
import { validateSafeContent } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, relatedId, userEmail } = body;

    // Validation
    if (!type || !["compound", "medicine", "correction"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid contribution type" },
        { status: 400 },
      );
    }

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 },
      );
    }

    if (!description || !description.trim()) {
      return NextResponse.json(
        { success: false, message: "Description is required" },
        { status: 400 },
      );
    }

    if (description.trim().length < 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be at least 20 characters",
        },
        { status: 400 },
      );
    }

    // Safety validation - prevent harmful content
    if (!validateSafeContent(description)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Content contains prohibited information. Please remove any synthesis instructions or harmful guidance.",
        },
        { status: 400 },
      );
    }

    if (!validateSafeContent(title)) {
      return NextResponse.json(
        {
          success: false,
          message: "Title contains prohibited information.",
        },
        { status: 400 },
      );
    }

    // Email validation if provided
    if (userEmail && !/^\S+@\S+\.\S+$/.test(userEmail)) {
      return NextResponse.json(
        { success: false, message: "Invalid email address" },
        { status: 400 },
      );
    }

    await connectDB();

    // Create contribution
    const contribution = await Contribution.create({
      type,
      title: title.trim(),
      description: description.trim(),
      relatedId: relatedId?.trim() || undefined,
      userEmail: userEmail?.trim() || undefined,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contribution submitted successfully",
        data: { id: contribution._id },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit contribution" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    await connectDB();

    const query: any = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }
    if (type && ["compound", "medicine", "correction"].includes(type)) {
      query.type = type;
    }

    const contributions = await Contribution.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: JSON.parse(JSON.stringify(contributions)),
    });
  } catch (error: any) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contributions" },
      { status: 500 },
    );
  }
}
