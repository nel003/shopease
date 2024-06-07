"use client" 
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation";

export default function ProfileLayot({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname();
    const router = useRouter();
    return(
        <>
            <div className="p-6">
                <div className="pb-6">
                    <h1 className="font-bold text-2xl">Account</h1>
                    <h2 className="text-muted-foreground pb-6">Manage your account and preferences.</h2>
                    <Separator/>
                </div>
                <div className="flex gap-6">
                    <div className="w-56 space-y-1">
                        <Button onClick={() => router.push("/profile")} variant="link" className={`h-8 w-full inline-flex justify-start text-foreground ${pathname === "/profile" ? "bg-foreground/5":"bg-transparent"}`}>Profile</Button>
                        <Button onClick={() => router.push("/apperance")} variant="link" className={`h-8 w-full inline-flex justify-start text-foreground ${pathname === "/apperance" ? "bg-foreground/5":"bg-transparent"}`}>Apperance</Button>
                        <Button onClick={() => router.push("/password")} variant="link" className={`h-8 w-full inline-flex justify-start text-foreground ${pathname === "/password" ? "bg-foreground/5":"bg-transparent"}`}>Password</Button>
                        <Button onClick={() => router.push("/address")} variant="link" className={`h-8 w-full inline-flex justify-start text-foreground ${pathname === "/address" ? "bg-foreground/5":"bg-transparent"}`}>Address</Button>
                    </div>
                    <div className="w-full">{children}</div>
                </div>
            </div>
        </>
    )
}