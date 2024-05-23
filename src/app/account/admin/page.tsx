"use client"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/store/useStore";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
  

function Admin() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {user, setUser} = useUserStore((state) => state);
    const router = useRouter();

    async function login() {
        try {
            const res = await axios({
                url: "/api/login/admin",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({username, password})
            });
            localStorage.setItem("token", res.data.token);
            router.push("/admin");
        } catch (error: any) {
            if (error.response.status >= 400) {
                toast({
                    title: "Error",
                    description: error.response.data.message
                });
                return;
            }
            toast({
                title: "Error",
                description: "Server error"
            });
        }
    }

    return(
        <div className="h-screen w-screen grid place-items-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label>Username</Label>
                        <Input onChange={(e) => setUsername(e.target.value)} value={username} type="email" required placeholder="Enter your email address."/>
                    </div>
                    <div className="relative">
                        <Eye onClick={() => setShowPassword(true)} className={`${showPassword ? "hidden":"block"} w-5 absolute right-2 top-8 text-foreground/60`}/>
                        <EyeOff onClick={() => setShowPassword(false)} className={`${showPassword ? "block":"hidden"} w-5 absolute right-2 top-8 text-foreground/60`}/>
                        <Label>Password</Label>
                        <Input onChange={(e) => setPassword(e.target.value)} value={password} type={`${showPassword ? "text":"password"}`} required placeholder="Enter your password."/>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={() => console.log(user)} variant="outline">Cancel</Button>
                    <Button onClick={login} disabled={!username || !password}>Login</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Admin;