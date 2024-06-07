"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Apperance(){
    const {user} = useUserStore();
    const {setTheme, theme} = useTheme();
    const [ntheme, setNtheme] = useState("");

    useEffect(() => {
        setNtheme(theme || "");
    }, [theme]);

    return(
        <div className="">
            <h1 className="text-xl font-bold">Apperance</h1>
            <h3 className="text-muted-foreground">Customize the appearance of the app.</h3>
            <Separator className="my-4"/>
            <div className="space-y-2">
                <div className="max-w-xl">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                        <div onClick={() => setTheme("light")} className={`border rounded-md w-44 p-2 bg-white space-y-2 relative ${ntheme === "light" ? "border-primary" : "border-muted-foreground"}`}>
                            <div className="w-full bg-gray-100 rounded-md p-2 space-y-2">
                                <div className="h-3 w-full bg-white rounded-md"></div>
                                <div className="h-3 w-full bg-white rounded-md"></div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-md p-2 flex gap-2">
                                <div className="h-5 aspect-square bg-white rounded-full"></div>
                                <div className="h-3 w-full bg-white rounded-md mt-1"></div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-md p-2 flex gap-2">
                                <div className="h-5 aspect-square bg-white rounded-full"></div>
                                <div className="h-3 w-full bg-white rounded-md mt-1"></div>
                            </div>
                            <h1 className="absolute text-sm font-semibold w-full text-center left-0">Light</h1>
                        </div>

                        <div onClick={() => setTheme("dark")} className={`border rounded-md w-44 p-2 bg-gray-700 space-y-2 relative ${ntheme === "dark" ? "border-primary" : "border-muted-foreground"}`}>
                            <div className="w-full bg-gray-500 rounded-md p-2 space-y-2">
                                <div className="h-3 w-full bg-gray-400 rounded-md"></div>
                                <div className="h-3 w-full bg-gray-400 rounded-md"></div>
                            </div>
                            <div className="w-full bg-gray-500 rounded-md p-2 flex gap-2">
                                <div className="h-5 aspect-square bg-gray-400 rounded-full"></div>
                                <div className="h-3 w-full bg-gray-400 rounded-md mt-1"></div>
                            </div>
                            <div className="w-full bg-gray-500 rounded-md p-2 flex gap-2">
                                <div className="h-5 aspect-square bg-gray-400 rounded-full"></div>
                                <div className="h-3 w-full bg-gray-400 rounded-md mt-1"></div>
                            </div>
                            <h1 className="absolute text-sm font-semibold w-full text-center left-0">Dark</h1>
                        </div>
                    </div>
                </div>
                <div className="pt-8 flex gap-2">
                    <Button variant="outline">Back to Home</Button>
                </div>
            </div>
        </div>
    )
}