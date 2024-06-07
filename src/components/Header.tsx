"use client"
import {Box, LogOut, Menu, NotebookTabs, Search, Settings, ShoppingCart, User} from "lucide-react"
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useUserStore } from "@/store/useStore";
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

function Header() {
    const {user} = useUserStore();
    const router = useRouter();
    
    return(
        <header className="w-screen flex justify-center fixed top-0 bg-background/5 backdrop-blur-xl z-50">
            <div className="wrapper w-[1200px] p-4 flex">
                <div className="grow">
                    <h1 className="font-semibold text-lg">ShopEase</h1>
                </div>
                <div className="flex gap-4">
                    <div className="h-6 w-6 p-[2px]">
                        <Search className="w-6"/>
                    </div>
                    <div className={`h-6 w-18 -mt-[2px] ${user ? "hidden":"block"}`}>
                        <Button className="h-8 rounded-full">Sign In</Button>
                    </div>
                    <div className={`h-6 w-6 ${user ? "block":"hidden"}`}>
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
                    <div className={`h-6 w-6 ${user ? "block":"hidden"}`}>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="w-8 h-8 -mt-1">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="bottom" className="min-w-[200px]">
                                <h1 className="text-sm px-2 pt-1 font-semibold">{user?.username}</h1>
                                <h1 className="text-xs text-muted-foreground px-2 max-w-sm text-nowrap text-ellipsis overflow-hidden">{user?.email}</h1>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex justify-between">
                                    <span className="font-medium">Orders</span>
                                    <Box className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push("/profile")} className="flex justify-between">
                                    <span className="font-medium">Account</span>
                                    <User className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex justify-between">
                                    <span className="font-medium">Address</span>
                                    <NotebookTabs className="h-4 w-4" />
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="flex justify-between">
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