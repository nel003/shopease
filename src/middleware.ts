import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname.startsWith("/api/admin")) {
        try {
            const token = req.headers.get("Authorization")?.replace("Bearer ", '');
            
            if (!token) {
                return new Response(JSON.stringify({redirect: true, url: "/account/admin"}), {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    status: 401
                });
            }

            const decoded = await jwtVerify(token, new TextEncoder().encode("secrettsd"));
            const res = await fetch("http://localhost:3000/api/token/admin", {
                method: "GET",
                headers: {
                    "Refresh-Token": decoded.payload.token as string
                }
            });
            if((await res.json()).message !== "OK") {
                const res = await fetch("http://localhost:3000/api/token/admin", {
                    method: "GET",
                    headers: {
                        "Refresh-Token": decoded.payload.token as string
                    }
                });
            }
        } catch (error) {
            console.log(error)
            return new Response(JSON.stringify({redirect: true, url: "/account/admin"}), {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 401
            });
        }
    }
}