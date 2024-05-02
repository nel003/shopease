import { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
    // if(req.nextUrl.pathname.startsWith("/api/admin")) {
    //     const token = req.headers.get("authorization")?.split(" ")[1];
    //     if (!token) {
    //         return new Response(JSON.stringify({message: "Who are you?"}), {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             status: 401
    //         });
    //     }
    // }
}