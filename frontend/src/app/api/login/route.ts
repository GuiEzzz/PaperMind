import { NextRequest, NextResponse } from "next/server";
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.LOGIN_USER;
  const validPass = process.env.LOGIN_PASS;

  if (username === validUser && password === validPass) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    const res = NextResponse.json({ success: true });

    res.headers.set('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    }));    

    return res;
  } else {
    return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 });
  }
}
