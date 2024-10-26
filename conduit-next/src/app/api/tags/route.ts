import { prisma } from "../../../lib/prisma"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      select: {
        name: true
      }
    });

    return NextResponse.json({
      tags: tags.map(tag => tag.name)
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
