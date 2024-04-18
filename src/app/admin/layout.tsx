"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Layers3, LayoutDashboard, Package, Users } from "lucide-react";
import {useRouter, usePathname} from "next/navigation";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="w-screen flex">
                <div className="w-[15%] min-w-[250px] h-screen border-r p-6">
                    <div className="flex gap-3 p-2">
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
                        <div onClick={() => router.push("/")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname === "/admin/categories" ? "bg-accent" : ""}`}>
                            <Layers3 className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Categories</h1>
                        </div>
                        <div onClick={() => router.push("/")} className={`p-2 px-3 flex font-medium cursor-pointer text-foreground/80 gap-2 rounded-lg ${pathname === "/admin/products" ? "bg-accent" : ""}`}>
                            <Package className="w-4"/>
                            <h1 className="text-sm font-semibold mt-[2px]">Products</h1>
                        </div>
                    </div>
                </div>
                <div className="w-[85%] h-screen p-2 overflow-scroll">
                    {children}
                </div>
            </div>
        </>
    )
  }
