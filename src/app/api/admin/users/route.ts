export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser, hashPassword } from "@/lib/auth";

// GET — list all users
export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// PATCH — update user role or reset password
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role, newPassword, suspended, name, email, rewardPoints } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Prevent admins from demoting/suspending themselves
    if (userId === user.id && role && role !== "admin") {
      return NextResponse.json({ error: "You cannot remove your own admin access" }, { status: 400 });
    }
    if (userId === user.id && suspended === true) {
      return NextResponse.json({ error: "You cannot suspend yourself" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};

    if (role && (role === "admin" || role === "customer")) data.role = role;
    if (typeof suspended === "boolean") data.suspended = suspended;
    if (name && name.trim()) data.name = name.trim();
    if (email && email.trim()) data.email = email.toLowerCase().trim();
    if (typeof rewardPoints === "number") data.rewardPoints = rewardPoints;

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      data.password = await hashPassword(newPassword);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, suspended: true, rewardPoints: true },
      data,
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE — delete a user account
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    if (userId === user.id) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    // Delete user's reviews first (foreign key)
    await prisma.review.deleteMany({ where: { userId } });
    await prisma.drawingEntry.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
