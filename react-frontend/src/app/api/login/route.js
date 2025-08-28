import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'

const JWT_SECRET = "546efgjsdflkga;slefhfs"

export async function POST(req) {
    const { username, password } = await req.json()
    if (username === "admin" && password === "admin") {
        const resp = NextResponse.json({ success: true })
        const value = username + "$" + crypto.randomUUID() + "$" + password
        const token = jwt.sign(value, JWT_SECRET)
        resp.cookies.set("token", token, {
            maxAge:60*60,
            path:"/"
        })
        return resp
    }
    return NextResponse.json({ success: false })
}