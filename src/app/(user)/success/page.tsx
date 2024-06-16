"use client"
import Header from "@/components/Header";
import { PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Success() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/orders");
        }, 1500);
    }, []);

    return(
        <>
            <Header/>
            <div className="w-screen h-screen grid place-items-center">
                <div>
                    <PartyPopper className="w-40 h-40 text-green-500"/>
                    <h1 className="font-medium text-xl text-center mt-5">Order created</h1>
                </div>
            </div>
        </>
    );
}

export default Success;