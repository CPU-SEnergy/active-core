/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import {
  authMiddleware,
  getFirebaseAuth,
  redirectToHome,
  redirectToLogin,
} from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/lib/config";

const PUBLIC_PATHS = ["/auth/register", "/auth/login"];

export async function middleware(request: NextRequest) {
  const { getUser } = getFirebaseAuth({
    serviceAccount: serverConfig.serviceAccount,
    apiKey: serverConfig.apiKey,
  });

  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      const adminOnlyRoutes = [
        "/admin",
        "/admin/sales",
        "/admin/add-products-and-services",
        "/admin/cashier",
      ];

      const redirectPath = "/admin/active-customer";
      const path = request.nextUrl.pathname;

      if (PUBLIC_PATHS.includes(path)) {
        return redirectToHome(request);
      }

      const user = await getUser(decodedToken.uid);
      const role = user?.customClaims?.role;


      console.log("User role", { role });

      const isAdminRoute = path.startsWith("/admin");

      if (isAdminRoute && role !== "cashier" && role !== "admin") {
        return new NextResponse("Forbidden: Admins only", {
          status: 403,
          headers,
        });

      const isAdminRoute = path.startsWith("/admin");

      if (isAdminRoute) {
        if (path === redirectPath) {
          return NextResponse.next({
            request: {
              headers,
            },
          });
        }

        if (
          role === "cashier" &&
          adminOnlyRoutes.some(
            (route) => path === route || path.startsWith(`${route}/`)
          )
        ) {
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        if (role !== "admin" && role !== "cashier") {
          return new NextResponse("Forbidden: Unauthorized role", {
            status: 403,
            headers,
          });
        }

      }

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },

    handleInvalidToken: async (reason) => {
      console.info("Missing or malformed credentials", { reason });

      return redirectToLogin(request, {
        path: "/auth/login",
        publicPaths: PUBLIC_PATHS,
      });
    },
    handleError: (error) => {
      console.log({ cause: (error as any).cause, stack: (error as any).stack });

      return Promise.resolve(
        redirectToLogin(request, {
          path: "/auth/login",
          publicPaths: PUBLIC_PATHS,
        })
      );
    },
  });
}

export const config = {
  matcher: [
    "/user-profile",
    "/admin/:path*",
    "/cashier/:path*",
    "/api/login",
    "/api/logout",
  ],
};
