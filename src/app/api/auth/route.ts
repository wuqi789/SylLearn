import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (action === "register") {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: "Email, password, and name are required" },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          password: hashedPassword,
          name,
          isAnonymous: false,
        },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        isAnonymous: false,
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAnonymous: user.isAnonymous,
        },
      });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        isAnonymous: user.isAnonymous,
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAnonymous: user.isAnonymous,
        },
      });
    }

    if (action === "anonymous") {
      const anonId = uuidv4().slice(0, 8);
      const anonEmail = `anon-${anonId}@syllearn.local`;
      const anonName = `Guest-${anonId}`;

      const hashedPassword = await bcrypt.hash(anonId, 10);
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email: anonEmail,
          password: hashedPassword,
          name: anonName,
          isAnonymous: true,
        },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        isAnonymous: true,
      });

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAnonymous: user.isAnonymous,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    const message = process.env.NODE_ENV === "development"
      ? (error instanceof Error ? error.message : "Internal server error")
      : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
