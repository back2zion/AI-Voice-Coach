import { NextResponse } from "next/server";

// Mock token for local development
export async function GET(req){
    // Return a mock token for local development
    const mockToken = {
        token: "mock-local-token-" + Date.now(),
        expires_in: 3600
    };
    return NextResponse.json(mockToken);
}