import { NextRequest, NextResponse } from "next/server";
import {
  defaultLocale,
  isValidLocale,
  locales,
  type Locale,
} from "@/i18n/config";

const LOCALE_COOKIE = "locale";

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isValidLocale(cookie)) {
    return cookie;
  }

  const accept = request.headers.get("accept-language") ?? "";
  if (/\bpl\b/i.test(accept)) {
    return "pl";
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameHasLocale) {
    const segment = pathname.split("/")[1];
    if (isValidLocale(segment)) {
      const response = NextResponse.next();
      response.cookies.set(LOCALE_COOKIE, segment, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
      return response;
    }
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
