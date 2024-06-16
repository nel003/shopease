"use client"
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import formatPrice from "@/utils/formatPrice";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Label } from "recharts";
  
interface Orders {
    order_id: number
    order_number: string
    product_name: string
    thumbnail: string
    price: number
    quantity: number
    total: number
    status: number
    status_text: number
    variant: string
    count: number
}

type Item = {
    product_name: string
    thumbnail: string
    quantity: number
    price: number
    variant: string
}

type Order = {
    customer_id: number
    address_id: number
    address: string | null
    username: string
    payment_method: number
    status: number
    status_text: string
    description: string
    quantity: number
    total: number
    order_on: string
    number: string
    items: Item[]
}

const statusList: any = {
    1: "Pending",
    2: "To Receive",
    3: "Received",
    4: "Cancelled"
}

function Orders() {

    return(
        <>
            <Header/>
            <div className="pt-20 flex justify-center min-h-screen">
                <div className="max-w-[1200px] w-full h-96 p-4">
                    <h2 className="font-bold w-full text-center pb-4">My Orders</h2>
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="overflow-x-scroll max-w-full pl-8">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="toreceived">To Received</TabsTrigger>
                            <TabsTrigger value="received">Received</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all">
                            <Items type={0}/>
                        </TabsContent>
                        <TabsContent value="pending">
                            <Items type={1}/>
                        </TabsContent>
                        <TabsContent value="toreceived">
                            <Items type={2}/>
                        </TabsContent>
                        <TabsContent value="received">
                            <Items type={3}/>
                        </TabsContent>
                        <TabsContent value="cancelled">
                            <Items type={4}/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

function Items({type}:{type:number}) {
    const [orders, setOrders] = useState<any>({});
    
    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const res = await axios.get("/api/user/orders?type="+type);
            setOrders(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
            toast("Server error.");
        }
    }

    async function cancel(id: number) {
        try {
            await axios({
                url: "/api/user/order/"+id,
                method: 'PUT'
            });
            loadOrders();
            toast("Order cancelled.");
        } catch (error) {
            toast("Order cancellation failed.");
        }
    }

    return(
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
            {Object.keys(orders).map((it, id) => {
                const i: Orders = orders[it];
                return(
                <div key={id} className="w-full p-4 shadow-[0_10px_40px_hsl(var(--foreground)/0.1)] gap-2 rounded-md space-y-3">
                    <div className="flex w-full justify-between">
                        <h3 className="text-sm">#{it}</h3>
                        <h3 className="text-sm text-primary">{statusList[i.status]}</h3>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-18 w-20 bg-black rounded-md relative overflow-hidden">
                            <img src={i.thumbnail} className="aspect-square w-full object-cover object-center" alt="" />
                        </div>
                        <div className="w-full flex flex-col">
                            <h3>{i.product_name}</h3>
                            <div className="w-full flex justify-between">
                                <div className="text-xs text-muted-foreground">{i.variant}</div>
                                <div className="text-sm">x{i.quantity}</div>
                            </div>
                            <span className="grow"></span>
                            <div className="w-full">
                                <h1 className="w-full text-right text-primary font-semibold text-sm">{formatPrice(i.price)}</h1>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="p-2 border-b border-t flex justify-between">
                            <h4 className="text-[10px] text-muted-foreground whitespace-nowrap pt-1">{i.count} {i.count > 1 ? "items" : "item" }</h4>
                            <h1 className="w-full text-right text-sm">Order Total: <span className="text-primary font-semibold ">{formatPrice(i.total)}</span></h1>
                        </div>
                        <div className="p-2 flex justify-between">
                            <h4 className="text-[12px] whitespace-nowrap pt-1 text-green-400">{i.status_text}</h4>
                            <ChevronRight className="w-4 text-muted-foreground"/>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className={`cursor-pointer p-1 flex justify-center border-t pt-3`}>
                                    <h4 className="text-[10px] text-muted-foreground">View Details</h4>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Order#{it}</AlertDialogTitle>
                                    <OrderInfo id={i.order_id}/>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <AlertDialogAction onClick={() => cancel(i.order_id)} disabled={i.status != 1}>Cancel Order</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog> 
                    </div>
                    
                </div>
            )})}
        </div>
    )
}

function OrderInfo({id}:{id:number}) {
    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        loadOrder();
    }, [])

    async function loadOrder() {
        try {
            const res = await axios.get("/api/user/order/"+id);
            setOrder(res.data)
        } catch (error) {
            
        }
    }

    return(
        <div>
            <div className="space-y-2 max-h-[700px] overflow-scroll">
                <div className={`${order?.address ? "block":"hidden"}`}>
                    <h1 className="text-sm text-muted-foreground">Address</h1>
                    <span className="text-sm">{order?.address}</span>
                </div>
                <div className={`${order?.address ? "hidden":"block"}`}>
                    <h1 className="text-sm text-muted-foreground">Pick-up Address</h1>
                    <span className="text-sm">Building 143, Tuburan, Pagadian City</span>
                </div>
                <h1 className="text-sm text-muted-foreground">Items</h1>
                {order?.items.map((it, id) => (
                <div key={id} className="flex gap-2 text-left">
                    <div className="h-18 w-20 bg-black rounded-md relative overflow-hidden">
                        <img src={it.thumbnail} className="aspect-square w-full object-cover object-center" alt="" />
                    </div>
                    <div className="w-full flex flex-col">
                        <h3>{it.product_name}</h3>
                        <div className="w-full flex justify-between">
                            <div className="text-xs text-muted-foreground">{it.variant}</div>
                            <div className="text-sm">x{it.quantity}</div>
                        </div>
                        <span className="grow"></span>
                        <div className="w-full">
                            <h1 className="w-full text-right text-primary font-semibold text-sm">{formatPrice(it.price)}</h1>
                        </div>
                    </div>
                </div>
                ))}
                <div className={`flex justify-between ${order?.address ? "block":"hidden"}`}>
                    <h1 className="text-sm text-muted-foreground">Shipping Fee</h1>
                    <span className="text-sm text-primary font-bold">{formatPrice(120)}</span>
                </div>
            </div>
        </div>
    )
}

export default Orders;