

"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
  
export default function Password(){
    const {user} = useUserStore();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reNewpassword, setReNewPassword] = useState("");

    async function update() {
        try {
            const res = await axios({
                url: "/api/user/password",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({password, newpassword: newPassword, renewpassword: reNewpassword})
            });
            toast("Password updated");
        } catch (error: any) {
            if (error.response.status == 400) {
                toast(error.response.data.message);
                return;
            }
            toast("Server error");
        }
    }

    return(
        <div className="">
            <h1 className="text-xl font-bold">Password</h1>
            <h3 className="text-muted-foreground">Secure your account.</h3>
            <Separator className="my-4"/>
            <div className="space-y-2">
                <div className="max-w-xl">
                    <Label>Old password</Label>
                    <Input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Enter old password"/>
                </div>
                <div className="max-w-xl">
                    <Label>New password</Label>
                    <Input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder="Enter new password"/>
                </div>
                <div className="max-w-xl">
                    <Label>Re-enter password</Label>
                    <Input onChange={(e) => setReNewPassword(e.target.value)} value={reNewpassword} placeholder="Re-enter new password"/>
                </div>
                <div className="pt-4 flex gap-2">
                    <Button disabled={!password || !newPassword || !reNewpassword} onClick={update}>Update password</Button>
                </div>
            </div>
        </div>
    )
}