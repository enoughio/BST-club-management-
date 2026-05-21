import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export default function proxy (request : NextRequest ) {

    const { pathname } = request.nextUrl;

    const token = request.cookies.get("x-bst-token")?.value ; 
    const userRole = request.cookies.get("x-bst-user-role")?.value ;
    
    console.log(`middleware called  ${userRole} ${token} ${pathname}`);

    // log for runtime verification
    // try {
    //     console.log("[middleware]", { pathname, token: !!token, userRole });
    // } catch (e) {
    //     // ignore logging errors in edge environments
    // }

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
        console.log("[middleware] redirecting to role dashboard", userRole);
        return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    }

    return NextResponse.next();
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


// import { NextRequest, NextResponse } from "next/server";

// export default function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("x-bst-token")?.value;
//   const role = request.cookies
//     .get("x-bst-user-role")
//     ?.value?.trim()
//     .toLowerCase();

//   const authRoutes = ["/login", "/register"];

//   // not logged in
//   if (!token && !authRoutes.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // logged in visiting auth pages
//   if (token && authRoutes.includes(pathname)) {
//     return NextResponse.redirect(
//       new URL(`/${role}/dashboard`, request.url)
//     );
//   }

//   // root redirect
//   if (token && pathname === "/") {
//     return NextResponse.redirect(
//       new URL(`/${role}/dashboard`, request.url)
//     );
//   }

//   // prevent cross-role access
//   const roleRoots = ["/admin", "/member", "/superadmin"];

//   const isRolePath = roleRoots.some(
//     (p) => pathname === p || pathname.startsWith(`${p}/`)
//   );

//   if (token && isRolePath && role && !pathname.startsWith(`/${role}`)) {
//     return NextResponse.redirect(
//       new URL(`/${role}/dashboard`, request.url)
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };