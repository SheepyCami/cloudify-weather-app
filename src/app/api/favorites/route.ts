import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favoriteCity.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cityName } = await request.json();

  const favorite = await prisma.favoriteCity.create({
    data: {
      cityName,
      userId: session.user.id,
    },
  });

  return NextResponse.json(favorite);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cityName } = await request.json();

  await prisma.favoriteCity.delete({
    where: {
      cityName_userId: {
        cityName,
        userId: session.user.id,
      },
    },
  });

  return NextResponse.json({ success: true });
} 