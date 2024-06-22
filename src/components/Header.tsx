"use client"
import {Box, Home, LogOut, Menu, NotebookTabs, Search, Settings, ShoppingCart, User} from "lucide-react"
import { usePathname, useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCartCount, useUserStore } from "@/store/useStore";
import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Cart from "./Cart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"  
import { Label } from "./ui/label";
import { Input } from "./ui/input";


function Header() {
    const {user, setUser} = useUserStore();
    const router = useRouter();
    const {cartCount, setCartCount} = useCartCount();
    const pathname = usePathname();

    const [search, setSearch] = useState("");

    useEffect(() => {
        initCart();
    }, []);

    async function initCart() {
        try {
            const res = await axios.get("/api/user/count");
            setCartCount(res.data[0].quantity);
        } catch (error) {
            console.log(error)
        }
    }

    async function logout() {
        try {
            await axios.post("/api/user/logout")
            setUser(null);
            router.push("/home");
        } catch (error) {
            
        }
    }
    
    return(
        <header className="w-screen flex justify-center fixed top-0 bg-background/5 backdrop-blur-xl z-50">
            <div className="wrapper w-[1200px] p-4 flex">
                <div className="grow">
                    <h1 className="font-semibold text-lg">ShopEase</h1>
                </div>
                <div className="flex gap-4">
                    <div className="h-6 w-6 p-[2px]">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Search className="w-6"/>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="end">
                                <h1 className="w-full text-center text-sm font-bold pb-5">Search product</h1>
                                <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search something..."/>
                                <Button onClick={() => router.push("/products?search="+search)} className="mt-6 w-full">Search</Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={`h-6 w-18 -mt-[2px] ${user ? "hidden":"block"}`}>
                        <Button onClick={() => router.push("/account")} className="h-8 rounded-full">Sign In</Button>
                    </div>
                    <div className={`h-6 w-6 relative ${user ? "block":"hidden"}`}>
                        <h1 className={`text-[9px] aspect-square h-[16px] bg-primary absolute -right-1 -top-1 text-center pt-[1px] rounded-full text-white ${cartCount ? "block":"hidden"}`}>{cartCount}</h1>
                        <Sheet>
                            <SheetTrigger asChild>
                                <ShoppingCart className="w-6"/>
                            </SheetTrigger>
                            <SheetContent className="h-full w-full p-0">
                                <SheetHeader>
                                    <SheetTitle className="p-4">Cart</SheetTitle>
                                </SheetHeader>
                                <Cart/>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className={`h-6 w-6 mr-4 ${user ? "block":"hidden"}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="w-8 h-8 -mt-1">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="capitalize">{user?.username[0]}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="bottom" className="min-w-[200px]">
                                <h1 className="text-sm px-2 pt-1 font-semibold">{user?.username}</h1>
                                <h1 className="text-xs text-muted-foreground px-2 max-w-sm text-nowrap text-ellipsis overflow-hidden">{user?.email}</h1>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/home")} className={`justify-between ${pathname != "/home" ? "flex":"hidden"}`}>
                                    <span className="font-medium">Home</span>
                                    <Home className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/orders")} className="flex justify-between">
                                    <span className="font-medium">Orders</span>
                                    <Box className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/profile")} className="flex justify-between">
                                    <span className="font-medium">Account</span>
                                    <User className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="flex justify-between">
                                    <span className="font-medium">Log out</span>
                                    <LogOut className="h-4 w-4" />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;