import { NextResponse } from "next/server";

export async function middleware(request) {
    // 로컬 개발 환경에서는 인증 체크를 건너뜀
    return NextResponse.next();
}

export const config = {
  // 로컬 개발에서는 미들웨어 비활성화
  matcher: [],
};
  