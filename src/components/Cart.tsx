import formatPrice from "@/utils/formatPrice";
import axios from "axios";
import { Minus, Plus, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface Item {
    id: number
    quantity: number
    product_name: string
    thumbnail: string
    variant_name: string
    price: number
}

export default function Cart() {
    const [cart, setCart] = useState<Item[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            await loadCart();
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        let t = 0;
        cart?.forEach(i => {
            t += i.price * i.quantity
        });
        setTotal(t);
    }, [cart]);
    
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
    
    async function del(id: number) {
        try {
           const res = await axios({
            url: "/api/user/cart",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({id})
           }); 
           loadCart();
        } catch (error) {
            console.log(error)
        }
    }

    async function update(id: number, type: string) {
        try {
           const res = await axios({
            url: "/api/user/cart",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({id, type})
           }); 
           loadCart();
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <>
            <div className="w-full h-full relative p-4">
                {cart ? cart?.map((it, id) => {
                    return(
                        <div key={id} className="py-3 flex gap-2 border-b">
                            <div className="h-14 aspect-square relative">
                                <img className="w-full object-cover object-center aspect-square rounded-md" src={it.thumbnail} alt="t" />
                            </div>
                            <div className="flex flex-col justify-between w-full">
                                <div className="w-full flex justify-between">
                                    <h1 className="text-sm text-left">{it.product_name}</h1>
                                    <Trash2 onClick={() => del(it.id)} className="w-4 text-red-300"/>
                                </div>
                                <h1 className="text-sm text-left text-muted-foreground">{it.variant_name}</h1>
                                <div className="w-full flex justify-between">
                                    <h1 className="text-sm font-semibold text-left text-primary">{formatPrice(it.price)}</h1>
                                    <div className="w-auto flex border rounded-md px-1">
                                        <Minus onClick={() => update(it.id, "decrement")} className="w-3"/>
                                        <h1 className="p-1 px-3 text-xs">{it.quantity}</h1>
                                        <Plus onClick={() => update(it.id, "increment")} className="w-3"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }) : <div className="w-full h-full grid place-items-center">
                        <h1>Cart Loading...</h1>
                    </div>}
                {cart === undefined || cart.length < 1 && !isLoading ? <div className="w-full h-full grid place-items-center">
                        <h1>Cart is empty</h1>
                    </div> : ""}
                
                <div className="w-full absolute h-36 bottom-0 p-4 left-0 border-t flex justify-between">
                    <h1 className="font-semibold text-lg pt-1">Total: {formatPrice(total)}</h1>
                    <Button onClick={() => router.push("/checkout")}>Check out</Button>
                </div>
            </div>
        </>
    )
}