"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import { Button } from "@/components/ui/button";
import { Trash2, File } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import formatPrice from "@/utils/formatPrice";
import { useDebounce } from "use-debounce";

interface Order {
    checked: boolean
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
    address: string
}

const statusList: any = {
    1: "Pending",
    2: "To Receive",
    3: "Received",
    4: "Cancelled"
}

function color(n: number) {
    if (n == 2 || n == 3) {
        return {text: "text-green-300", bg: "bg-green-300/5"}
    }
    if (n == 4) {
        return {text: "text-red-300", bg: "bg-red-300/5"}
    }
    return {text: "text-yellow-300", bg: "bg-yellow-300/5"}
}

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [debounce] = useDebounce(search, 300);

    useEffect(() => {
        loadOrders();
    }, [debounce]);

    async function loadOrders() {
        try {
            const res = await axios.get("/api/admin/orders?s="+search);
            setOrders(res.data.map((i: Order) => ({...i, checked: false}))); 
        } catch (error) {
            toast("Something went wrong-");
        }
    }

    async function del() {
        try {
            const ids = orders.filter(i => (i.checked)).map(i => (i.order_id))
            if (ids.length < 1) {
                return;
            }
            await axios({
                url: "/api/admin/orders",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({ids})
            });
            loadOrders();
        } catch (error) {
            toast("Something went wrong.");
        }
    } 

    async function exportO() {
        try {
            const res = await axios.get("/api/admin/export/orders");
            router.push(res.data.path);
        } catch (error) {
            toast("Failed to export");
        }
    }

    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>Manage Orders</CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <div className="w-full">
                        <div className="mb-1 flex gap-1">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline"><Trash2 className="w-4 text-red-300"/></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Delete selected orders?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the orders from the servers.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={del}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div>
                                <Input className="w-80" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search by #"/>
                            </div>
                            <span className="grow"></span>
                            <div>
                                <Button onClick={exportO}><File className="w-4"/>&nbsp;Export</Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Table>
                            <TableCaption>A list of orders.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox onCheckedChange={(c: boolean) => setOrders(orders.map((i) => ({...i, checked: c})))}/>
                                    </TableHead>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Total Items</TableHead>
                                    <TableHead>Order Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[100px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((it, id) => (
                                    <TableRow key={id}>
                                        <TableCell>
                                            <Checkbox onCheckedChange={(c: boolean) => setOrders(orders.map((i) => (i.order_id === it.order_id ? {...i, checked: c} : i)))} checked={it.checked}/>
                                        </TableCell>
                                        <TableCell>{it.order_number}</TableCell>
                                        <TableCell>Cash on Delivery</TableCell>
                                        <TableCell>{it.quantity}</TableCell>
                                        <TableCell>{formatPrice(it.total)}</TableCell>
                                        <TableCell>
                                            <div className={`p-1 rounded-full ${color(it.status).bg} text-center text-xs ${color(it.status).text}`}>
                                                {statusList[it.status]}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => router.push("/admin/order/"+it.order_id)} variant="outline" className="h-8">Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Orders;