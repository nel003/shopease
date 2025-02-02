"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import axios from "axios";
import { Boxes, ChevronRight, Cog, Layers3, LayoutDashboard, Moon, Package, Sun, Users } from "lucide-react";
import {useRouter, usePathname} from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useUserStore } from "@/store/useStore";
import { useTheme } from "next-themes";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useUserStore((s) => (s));
    const [isUserMounted, setIsUserMounted] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [pt, setPt] = useState("");
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        initUser();
    }, [])

    useEffect(() => {
        setPt(theme || "");
    }, [theme])

    async function initUser() {
        try {
            const res = await axios({
                url: "/api/token/admin",
                method: "GET",
                headers: {
                    "Refresh-Token": localStorage.getItem("token")
                }
            });
            setUser(res.data.user);
            axios.defaults.headers.common["Authorization"] = res.data.user?.token;
            setIsUserMounted(true);
        } catch (error: any) {
            if (error.response.data.redirect == true) {
                router.push(error.response.data.url);
            }
        }
    }

    return (
        <>
            <div className="w-screen flex">
                <div className={`w-[250px] duration-200 ${showNav ? "left-0":"-left-[250px]"} md:left-0 md:w-full md:min-w-[250px] md:max-w-[250px] bg-background h-screen border-r z-50 absolute md:relative p-4`}>
                    <div className="w-full mt-6 px-0 flex gap-2 relative">
                        <div onClick={() => setShowNav(!showNav)} className="block md:hidden w-5 h-6 rounded-full rounded-tl-none rounded-bl-none border border-l-background absolute -top-1 -right-9">
                            <ChevronRight className={`w-4 duration-500 ${showNav ? "rotate-0":"rotate-180"}`}></ChevronRight>
                        </div>
                        <Avatar>
                            <AvatarImage src="#" alt="@shadcn" />
                            <AvatarFallback>AL</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold leading-3 mt-[10px]">Arnel Lopena</h1>
                            <h2 className="text-[10px] font-medium">Admin</h2>
                        </div>
                    </div>
                    <div className="space-y-1 mt-10">
                        <div onClick={() => router.push("/admin")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname === "/admin" ? "bg-accent" : ""}`}>
                            <LayoutDashboard className="w-4"/>
                            <h1 className="text-sm text-foreground/80 font-semibold mt-[2px]">Dashboard</h1>
                        </div>
                        <div onClick={() => router.push("/admin/customers")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname === "/admin/customers" ? "bg-accent" : ""}`}>
                            <Users className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Customers</h1>
                        </div>
                        <div onClick={() => router.push("/admin/categories")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname === "/admin/categories" ? "bg-accent" : ""}`}>
                            <Layers3 className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Categories</h1>
                        </div>
                        <div onClick={() => router.push("/admin/products")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname.startsWith("/admin/products") ? "bg-accent" : ""}`}>
                            <Package className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Products</h1>
                        </div>
                        <div onClick={() => router.push("/admin/orders")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname.startsWith("/admin/orders") ? "bg-accent" : ""}`}>
                            <Boxes className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Orders</h1>
                        </div>
                    </div>
                    <div className="p-2 space-y-2">
                    <div className="mt-9">
                        <h1 className="text-sm mb-1 text-muted-foreground">Theme</h1>
                        <div className="w-full border rounded-lg">
                            <div onClick={() => setTheme("system")} className={`p-4 py-3 text-xs font-bold border-b hover:bg-primary/5 hover:text-accent-foreground flex cursor-pointer ${pt === "system" ? "bg-primary/5 text-accent-foreground":"text-muted-foreground"}`}>
                                <span className="grow">System</span>
                                <Cog className="w-4 h-4"/>
                            </div>
                            <div onClick={() => setTheme("dark")} className={`p-4 py-3 text-xs font-bold border-b hover:bg-primary/5 hover:text-accent-foreground flex cursor-pointer ${pt === "dark" ? "bg-primary/5 text-accent-foreground":"text-muted-foreground"}`}>
                                <span className="grow">Dark</span>
                                <Moon className="w-4 h-4"/>
                            </div>
                            <div onClick={() => setTheme("light")} className={`p-4 py-3 text-xs font-bold hover:bg-primary/5 hover:text-accent-foreground flex cursor-pointer ${pt === "light" ? "bg-primary/5 text-accent-foreground":"text-muted-foreground"}`}>
                                <span className="grow">Light</span>
                                <Sun className="w-4 h-4"/>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="w-full h-screen overflow-scroll p-2">
                    {isUserMounted ? children : <h1>Initializing user...</h1>}
                </div>
            </div>
        </>
    )
  }
