import { NextResponse } from 'next/server';
import { generateDashboardState } from '@/lib/mockData';

export async function GET() {
  try {
    const dashboardState = generateDashboardState();
    
    return NextResponse.json(dashboardState, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to generate dashboard data' },
      { status: 500 }
    );
  }
}
