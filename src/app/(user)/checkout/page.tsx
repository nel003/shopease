"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import formatPrice from "@/utils/formatPrice";
import axios from "axios";
import { Box, HandCoins, InfoIcon, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  
type Address = {
    id: number
    fullname: string
    number: string
    house: string
    province: string
    city: string
    barangay: string
}

interface Item {
    id: number
    quantity: number
    product_name: string
    thumbnail: string
    variant_name: string
    price: number
}

const paymentMethods = [
    // {
    //     id: 1,
    //     name: "Gcash"
    // },
    // {
    //     id: 2,
    //     name: "Maya"
    // },
    {
        id: 3,
        name: "Cash on Delivery"
    },
]

const shippingMethods = [
    {
        id: 1,
        name: "In-store Pickup",
        price: 0
    },
    {
        id: 2,
        name: "Standard Shipping",
        price: 120
    }
]

function Checkout() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [cart, setCart] = useState<Item[]>();
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState<number | null>(null);
    const [payment, setPayment] = useState<number>();
    const [shipping, setShipping] = useState<number>();

    const router = useRouter();

    useEffect(() => {
        loadAddresses();
        loadCart();
    }, []);

    useEffect(() => {
        let t = 0;
        cart?.forEach(i => {
            t += i.price * i.quantity
        });
        t += shippingMethods.find(i => (i.id == shipping))?.price || 0;
        setTotal(t);
    }, [cart, shipping]);

    async function loadAddresses() {
        try {
            const res = await axios.get("/api/user/addresses");
            setAddresses(res.data);
        } catch (error) {
            toast("Failed to load addresses!");
        }
    }

    async function loadCart() {
        try {
            const res = await axios({
                url: "/api/user/cart",
                method: "GET"
            });
            setCart(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    async function checkout(e: React.MouseEvent<HTMLButtonElement>) { 
        const target = e.target as HTMLButtonElement;
        target.innerText = "Processing...";
        target.disabled = true;
        try {
            await axios({
                url: "/api/user/checkout",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({address, payment, shipping})
            });
            router.push("/success");
        } catch (error: any) {
            if (error.response.status == 400) {
                toast(error.response.data.message);
                return;
            }
            toast("Something went wrong!");
        } finally {
            target.innerText = "Place Order";
            target.disabled = false;
        }
    }

    return(
        <div>
            <Header/>
            <div className="w-full flex justify-center">
                <div className="max-w-[1200px] w-full min-h-screen px-6 py-20 relative">
                    <div className="w-full grid place-items-center">
                        <h1 className="text-lg font-bold">Checkout</h1>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-lg">Shipping Method</h1>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {shippingMethods.map((it, id) => (
                                <div onClick={() => setShipping(it.id)} key={id} className={`cursor-pointer w-full flex justify-between p-4 border rounded-lg ${shipping === it.id ? "border-primary" : "border-accent"}`}>
                                    <h1 className="font-medium">{it.name}</h1>
                                    <h1 className={`${it.price === 0 ? "hidden":"block"} text-muted-foreground`}>₱{it.price}</h1>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <InfoIcon className={`${it.price === 0 ? "block":"hidden"} text-muted-foreground w-5`}/>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" side="top">
                                            <h3>Building 143, Tuburan, Pagadian City</h3>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`${!shipping || shipping == 1 ? "opacity-40":"opacity-100"}`}>
                        <h1 className="text-lg">Address</h1>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((it, id) => (
                                <div key={id} onClick={() => setAddress(!shipping || shipping == 1 ? null : it.id)} className={`border border-dashed p-2 rounded-lg ${address === it.id ? "border-primary" : "border-accent"}`}>
                                    <h1 className="text-md font-medium">{it.fullname} <span className="text-muted-foreground">| {it.number}</span></h1>
                                    <h2 className="">{it.house}, {it.barangay}, {it.city}, {it.barangay}, {it.province}</h2>
                                </div>
                            ))}
                            <div onClick={() => router.push("/address")} className="border border-dashed p-2 rounded-lg h-full w-full grid place-items-center">
                                <div className="flex gap-2">
                                    <PlusCircle className="w-4 text-muted-foreground" />
                                    <h1 className="text-muted-foreground">Add new address</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-lg">Items</h1>
                        <div className="w-full space-y-4 flex flex-col">
                            {cart?.map((it, id) => (
                                <div key={id} className="w-full flex gap-2">
                                    <div className="h-20 aspect-square relative rounded-md overflow-hidden">
                                        <img className="object-cover object-center aspect-square" src={it.thumbnail} alt="#" />
                                    </div>
                                    <div className="w-full">
                                        <h1>{it.product_name}</h1>
                                        <div className="w-full flex justify-between">
                                            <h1 className="text-muted-foreground">{it.variant_name}</h1>
                                            <h1 className="text-md ">x{it.quantity}</h1>
                                        </div>
                                        <h1 className="text-xl font-bold text-primary">{formatPrice(it.price)}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 pb-16">
                        <h1 className="text-lg">Payment Method</h1>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {paymentMethods.map((it, id) => (
                                <div onClick={() => setPayment(it.id)} key={id} className={`cursor-pointer w-full flex justify-between p-4 border rounded-lg ${payment === it.id ? "border-primary" : "border-accent"}`}>
                                    <h1 className="font-medium">{it.name}</h1>
                                    <HandCoins className="w-4"/>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full left-0 bottom-0 fixed py-4 flex justify-center bg-background border-t">
                        <div className="w-[1200px] flex justify-between px-6">
                            <div className="space-y-2">
                                <h1 className="text-sm text-muted-foreground">Shipping Fee</h1>
                                <h1 className="text-xl font-bold text-primary">{formatPrice(total)}</h1>
                            </div>
                            <div className="space-y-2 text-right">
                                <h1 className="text-sm text-primary/90">₱{shippingMethods.find(i => (i.id == shipping))?.price || 0}</h1> 
                                <Button className={`${!shipping || shipping === 2 ? "block":"hidden"}`} onClick={(e) => checkout(e)} disabled={!address || !shipping || !payment}>Place Order</Button>
                                <Button className={`${shipping === 1 ? "block":"hidden"}`} onClick={(e) => checkout(e)} disabled={!shipping || !payment}>Place Order</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;