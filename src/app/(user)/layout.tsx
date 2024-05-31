"use client"
import axios from "axios";
import {useRouter, usePathname} from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useStore";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useUserStore((s) => (s));
    const [isUserMounted, setIsUserMounted] = useState(false);

    useEffect(() => {
        initUser();
    }, [])

    async function initUser() {
        try {
            const res = await axios({
                url: "/api/token/customer",
                method: "GET",
                headers: {
                    "Refresh-Token": localStorage.getItem("token")
                }
            });
            console.log(res.data)
            setUser(res.data.user);
            axios.defaults.headers.common["Authorization"] = res.data.user?.token;
        } catch (error: any) {
            // if (error.response.data.redirect == true) {
            //     router.push(error.response.data.url);
            // }
        }
        setIsUserMounted(true);
    }
    return(<>{isUserMounted ? children :<h1>Loading...</h1>}</>)
}