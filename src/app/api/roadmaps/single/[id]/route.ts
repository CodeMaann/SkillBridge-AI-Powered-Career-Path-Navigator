import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Make sure this matches your prisma import path

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. AWAIT THE PARAMS FIRST (Next.js 15 requirement)
    const resolvedParams = await params;
    const roadmapId = resolvedParams.id;

    if (!roadmapId) {
      return NextResponse.json({ error: "Missing Roadmap ID" }, { status: 400 });
    }

    // 2. FETCH THE SINGLE ROADMAP
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId 
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json(roadmap);

  } catch (error) {
    console.error("Error fetching single roadmap:", error);
    return NextResponse.json({ error: "Failed to fetch roadmap" }, { status: 500 });
  }
}