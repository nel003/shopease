"use client"
import {Menu, Search, ShoppingCart, User} from "lucide-react"
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

function Header() {
    const router = useRouter();

    return(
        <header className="w-screen flex justify-center fixed top-0">
            <div className="wrapper w-[1200px] p-4 flex">
                <div className="grow">
                    <h1 className="font-semibold text-lg">ShopEase</h1>
                </div>
                <div className="flex pt-1 gap-4">
                    <div className="h-6 w-6 p-[2px]">
                        <Search className="w-6"/>
                    </div>
                    <div className="h-6 w-6">
                        <ShoppingCart className="w-6"/>
                    </div>
                    <div className="h-6 w-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Menu className="h-6 w-6"/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" side="bottom">
                                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/account')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Account</span>
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