import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export async function middleware(request : NextRequest ) {

    const { pathname } = request.nextUrl;

    const token = await request.cookies.get("x-bst-token")?.value;  
    const userRole = await request.cookies.get("x-bst-user-role")?.value;

    // redirect to login if not authenticated and not visiting auth pages
    if (!token && pathname !== "/login" && pathname !== "/register") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // if already logged in, then redirect to the user role based dashboard when visiting auth pages
    if (token && (pathname === "/login" || pathname === "/register")) {
        if (!userRole) return NextResponse.redirect(new URL("/login", request.url));

        if (userRole === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        if (userRole === "member") return NextResponse.redirect(new URL("/member/dashboard", request.url));
        if (userRole === "superadmin") return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
    }

    // if user is logged in and tries to access the root path, redirect to the user role based dashboard
    if (token && pathname === "/") {
        if (!userRole) return NextResponse.redirect(new URL("/login", request.url));
        if (userRole === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        if (userRole === "member") return NextResponse.redirect(new URL("/member/dashboard", request.url));
        if (userRole === "superadmin") return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
    }

    // prevent accessing other role areas
    const roleRoots = ["/admin", "/member", "/superadmin"];  
    const isRolePath = roleRoots.some((p) => pathname.startsWith(p));
    if (token && isRolePath && userRole && !pathname.startsWith(`/${userRole}`)) {
        return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/admin/:path*',
        '/member/:path*',
        '/superadmin/:path*'
    ]
};