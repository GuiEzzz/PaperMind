import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error('JWT inválido:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/doc', '/chat'], // ou outras rotas protegidas
};
