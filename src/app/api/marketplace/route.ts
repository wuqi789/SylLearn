import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.slice(7));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const packages = await prisma.marketplacePackage.findMany({
      where,
      orderBy: { downloads: "desc" },
    });

    const filtered = tag
      ? packages.filter((pkg: { tags: string }) => {
          const tags: string[] = JSON.parse(pkg.tags);
          return tags.includes(tag);
        })
      : packages;

    return NextResponse.json({ packages: filtered });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthUser(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      domain,
      difficulty,
      tags,
      prerequisites,
      objectives,
    } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    const pkg = await prisma.marketplacePackage.create({
      data: {
        id: uuidv4(),
        title,
        description,
        author: payload.email,
        domain: domain || "general",
        difficulty: difficulty || 1,
        tags: JSON.stringify(tags || []),
        prerequisites: JSON.stringify(prerequisites || []),
        objectives: JSON.stringify(objectives || []),
        downloads: 0,
        rating: 0,
      },
    });

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
