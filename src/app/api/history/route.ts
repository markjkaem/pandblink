import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn" },
        { status: 401 }
      );
    }

    // Parse pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 50);
    const skip = (page - 1) * limit;

    // Get total count of enhancements
    const totalCount = await prisma.usage.count({
      where: {
        userId: session.user.id,
        type: "enhancement",
      },
    });

    // Get history records with pagination
    const history = await prisma.usage.findMany({
      where: {
        userId: session.user.id,
        type: "enhancement",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        createdAt: true,
        enhancedImageUrl: true,
        originalFileName: true,
        imageWidth: true,
        imageHeight: true,
        originalSize: true,
        enhancedSize: true,
      },
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      history,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van je history" },
      { status: 500 }
    );
  }
}
