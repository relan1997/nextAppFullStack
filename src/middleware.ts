import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  // now we will see ki agar token hai toh kahan kahan jaa sakte ho aur agar nahi toh kahan kahan jaa sakte ho
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    // ab agar tumhare paas token hai aur tum inn above routes pe jaane ki koshish karte ho toh tum redirect hojaaoge
    if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next()
  }

  //return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  // kahan kahan tumhari middleware run kare , uske paths hum yaha par mention karte hai
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"], //for dashboard waala path, jahan jahan path ke aage kuch bhi aayega, wahan wahan pe hum middleware ko run karenge
};
