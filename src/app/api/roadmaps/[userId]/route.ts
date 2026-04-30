import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // 1. AWAIT THE PARAMS FIRST (Next.js 15 requirement)
    const resolvedParams = await params; 

    const roadmaps = await prisma.roadmap.findMany({
      // 2. USE THE RESOLVED PARAMS
      where: { userId: resolvedParams.userId }, 
      orderBy: { createdAt: 'desc' },
      select: { id: true, targetRole: true, createdAt: true }
    });
    
    return NextResponse.json(roadmaps);
    
  } catch (error) {
    console.error("Error fetching saved roadmaps:", error);
    return NextResponse.json({ error: "Failed to fetch roadmaps" }, { status: 500 });
  }
}