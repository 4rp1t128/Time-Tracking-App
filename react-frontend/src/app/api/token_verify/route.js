import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const JWT_SECRET = "546efgjsdflkga;slefhfs"

export async function POST(req) {
    const { token } = await req.json()
    const val = jwt.verify(token, JWT_SECRET);
    const array = val.split("$")
    if (array[0] === "admin" && array[2] === "admin") {
        return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false })
}