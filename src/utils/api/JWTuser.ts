import { User } from "@/store/useStore";
import { jwtVerify } from "jose";

export default async function getUser(req: Request) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", '') || "";
    const decoded = (await jwtVerify(token, new TextEncoder().encode("secrettsd"))).payload;
    return decoded as User["user"];
}