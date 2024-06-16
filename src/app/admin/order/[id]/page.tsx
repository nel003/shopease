"use client"
import { useParams, useSearchParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import formatPrice from "@/utils/formatPrice";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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

const status = {
    1: [
        {status: 1, text: "Your order is being processed."},
        {status: 1, text: "Your order is currently being prepared."},
        {status: 2, text: "Your order has been shipped."},
        {status: 2, text: "Your order is on its way."},
        {status: 2, text: "Your order is out for delivery."}
    ],
    2: [
        {status: 1, text: "Your order is being processed."},
        {status: 1, text: "Your order is currently being prepared."},
        {status: 2, text: "Your order is ready to pick-up."}
    ]
}

function Order() {
    const params = useParams();
    const id = params.id;
    const [order, setOrder] = useState<Order>();
    const [statusText, setStatusText] = useState("");
    const [cancelMsg, setCancelMsg] = useState("");

    useEffect(() => {
        loadOrderData();
    }, []);

    async function loadOrderData() {
        try {
            const res = await axios.get("/api/admin/order/"+id);
            console.log(res.data)
            setOrder(res.data);
            setStatusText(res.data.status_text+"@"+res.data.status);
        } catch (error) {
            
        }
    }

    async function update(type: string) {
        try {
            await axios({
                url: "/api/admin/order/"+id,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({type, statusText, cancelMsg})
            });
            toast("Order updated.");
        } catch (error) {
            toast("Something went wrong.");
        }
    }

    console.log(statusText)
    return(
        <div>
            <Card className="min-h-[95vh]">
                <CardHeader>
                    <CardTitle className="text-md font-medium">Order#{order?.number}</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex gap-10">
                    <div className="w-[60%] space-y-2">
                        <div>
                            <Label>Ordered By</Label>
                            <h1 className="text-muted-foreground">{order?.username}</h1>
                        </div>
                        <div>
                            <Label>Order Type</Label>
                            <h1 className="text-muted-foreground">{order?.address ? "shipment":"Pick-Up"}</h1>
                        </div>
                        <div>
                            <Label>Address</Label>
                            <h1 className="text-muted-foreground">{order?.address}</h1>
                        </div>
                        <div>
                            <Label>Payment Method</Label>
                            <h1 className="text-muted-foreground">Cash on Delivery</h1>
                        </div>
                        <div className="border rounded-md p-4 -ml-4">
                            <Label>Items</Label>
                            <div className="pt-2">
                                <div className="space-y-2"> 
                                    {order?.items.map((it, id) => (
                                        <div key={id} className="w-full flex gap-2 border-b pb-2">
                                            <div className="h-20 aspect-square bg-black rounded-md">
                                                <img src={it.thumbnail} alt="" className="w-full aspect-square object-cover object-center" />
                                            </div>
                                            <div className="w-full">
                                                <h1>{it.product_name}</h1>
                                                <div className="flex w-full justify-between">
                                                    <span className="text-muted-foreground">{it.variant}</span>
                                                    <h1>x{it.quantity}</h1>
                                                </div>
                                                <h1 className="w-full text-right text-primary font-bold">{formatPrice(it.price)}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={`w-full flex justify-between ${order?.address ? "block":"hidden"}`}>
                            <Label>Shipping Fee</Label>
                            <h1 className="text-primary">₱120</h1>
                        </div>
                        <div className="w-full flex justify-between">
                            <h1 className="text-muted-foreground text-sm">{order?.quantity } {order?.quantity && order?.quantity > 1 ? "Items":"Item"}</h1>
                            <h1 className="text-muted-foreground font-bold text-md">Order Total: <span className="text-primary font-bold">{formatPrice(order?.total || 0)}</span></h1>
                        </div>
                    </div>
                    <div className="w-[40%]">
                        <div className="pt-10 w-full">
                            <Label>Mark as</Label>
                            <Select onValueChange={(v) => setStatusText(v)} value={statusText}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    {order?.address ? status[1].map((it, id) => (
                                        <SelectItem key={id} value={it.text+"@"+it.status}>{it.text}</SelectItem>
                                    )):status[2].map((it, id) => (
                                        <SelectItem key={id} value={it.text+"@"+it.status}>{it.text}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-20 flex justify-between">
                    <div className="space-x-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Cancel</Button> 
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Cancel order?</AlertDialogTitle>
                                <div>
                                    <Label>Cancelation reason</Label>
                                    <Textarea onChange={(e) => setCancelMsg(e.target.value)} value={cancelMsg} placeholder="Enter custom message or leave it blank"></Textarea>
                                </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => update("cancel")}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>    
                                <Button className="bg-green-500">Complete Order</Button> 
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Complete this order?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => update("complete")} >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <Button onClick={() => update("update")} disabled={!statusText}>Update Status</Button> 
                </CardFooter>
            </Card>
        </div>
    )
}

export default Order;