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
import { getTokens } from "next-firebase-auth-edge";
import { toUser } from "./utils/helpers/user";

const PUBLIC_PATHS = ["/auth/register", "/auth/login"];
const cashierAllowedRoutes = [
  "/admin",
  "/admin/active-customer",
  "/admin/inactive-customer",
  "/admin/messages",
  "/admin/add-customer",
];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,

    handleValidToken: async ({ token, decodedToken }, headers) => {
      const path = request.nextUrl.pathname;
      // const tokens = await getTokens(request.cookies, {
      //   ...serverConfig,
      //   apiKey: clientConfig.apiKey,
      //   headers: request.headers,
      // });

      if (PUBLIC_PATHS.includes(path)) {
        return redirectToHome(request);
      }

      // if (!tokens) {
      //   return redirectToLogin(request, {
      //     path: "/auth/login",
      //     publicPaths: PUBLIC_PATHS,
      //   });
      // }

      const role = decodedToken.role;

      const isAdminRoute = path.startsWith("/admin");

      if (isAdminRoute) {
        if (role === "admin") {
          return NextResponse.next({ request: { headers } });
        }

        if (role === "cashier") {
          const isAllowed = cashierAllowedRoutes.some(
            (route) => path === route || path.startsWith(`${route}/`)
          );

          if (isAllowed) {
            return NextResponse.next({ request: { headers } });
          }

          return NextResponse.redirect(
            new URL("/admin/active-customer", request.url)
          );
        }

        return new NextResponse("Forbidden: Unauthorized role", {
          status: 403,
          headers,
        });
      }

      return NextResponse.next({ request: { headers } });
    },

    handleInvalidToken: async (reason) => {
      console.info("Missing or malformed credentials", { reason });

      return redirectToLogin(request, {
        path: "/auth/login",
        publicPaths: PUBLIC_PATHS,
      });
    },

    handleError: (error) => {
      console.error("Middleware error", {
        cause: (error as any).cause,
        stack: (error as any).stack,
      });

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
  matcher: ["/user-profile", "/admin/:path*", "/api/login", "/api/logout"],
};
