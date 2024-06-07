"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
  
export default function Profile(){
    const {user} = useUserStore();
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [birthdate, setBirthdate] = useState("");

    useEffect(() => {
        setUsername(user?.username || "");
        setName(user?.name || "");
        setEmail(user?.email || "");
        setGender(user?.gender || "");
        setBirthdate(user?.birthdate || "");
    }, [user]);

    async function update() {
        try {
            await axios({
                url: "/api/user/profile",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    username, name, email, gender, birthdate
                })
            });
            toast("Updated.");
        } catch (error) {
            toast("Server error");
        }
    }
    
    return(
        <div className="">
            <h1 className="text-xl font-bold">Profile</h1>
            <h3 className="text-muted-foreground">This is your details you see on the site.</h3>
            <Separator className="my-4"/>
            <div className="space-y-2">
                <div className="max-w-xl">
                    <Label>Username</Label>
                    <Input onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username"/>
                </div>
                <div className="max-w-xl">
                    <Label>Name</Label>
                    <Input onChange={(e) => setName(e.target.value)} value={name} placeholder="Fullname"/>
                </div>
                <div className="max-w-xl">
                    <Label>Email</Label>
                    <Input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email"/>
                </div>
                <div className="max-w-xl">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => setGender(v)} value={gender}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="max-w-xl">
                    <Label>Birthdate</Label>
                    <Input onChange={(e) => setBirthdate(e.target.value)} value={birthdate} type="date" placeholder="Birthday"/>
                </div>
                <div className="pt-4 flex gap-2">
                    <Button variant="outline">Back to Home</Button>
                    <Button disabled={!name || !email || !name || !username || !birthdate || !gender} onClick={update}>Update profile</Button>
                </div>
            </div>
        </div>
    )
}