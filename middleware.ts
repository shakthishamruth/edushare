import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// public is default? add private ones

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware((auth, req) => {

});



export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)", // Better exclusion for static files
        "/(api|trpc)(.*)", // Ensure API routes are included
    ],
};
