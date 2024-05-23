"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
  
type Variant = {
    hasChanges: boolean
    id: number
    preview: null,
    name: string
    price: number
    ids: string
    stock: number
    on_sale_price: number
    is_on_sale: number
}

function Variants() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [variants, setVariants] = useState<Variant[]>([]);

    useEffect(() => {
        loadVariants();
    }, []); 

    async function loadVariants() {
        try {
            const res = await axios({
                url: "/api/admin/products/new/variants/"+id,
                method: "GET"
            });
            setVariants(res.data.map((i: Variant) => ({...i, hasChanges: false})));
        } catch (error) {
            toast("Server error!")
        }
    }
    async function submit(e: React.MouseEvent<HTMLButtonElement>) {
        const target = e.target as HTMLButtonElement;
        target.disabled = true;
        target.innerText = "Processing..."
        try {
            const res = await axios({
                url: "/api/admin/products/new/variants/"+id,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({variants})
            });
            toast("Success");
            setTimeout(() => {
                router.push("/admin/products");
            }, 1000);
        } catch (error) {
            toast("Server error!")
        }
        target.disabled = false;
        target.innerText = "Save and Publish"
    }
    console.log(variants);

    return(
        <>
        <div className="p-5 space-y-3">
            <Button onClick={() => router.push("/admin/products")} variant="outline"><ArrowLeft className="w-4"></ArrowLeft> Back</Button>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Product overview</CardTitle>
                    <CardDescription>Manage variants, stocks and prices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Price, On Sale Price, On Sale and Stocks field are editable.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variant</TableHead>
                                <TableHead>IDs</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>On Sale Price</TableHead>
                                <TableHead>Stocks</TableHead>
                                <TableHead className="w-40">On Sale</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {variants.map((itm, idx) => {
                                return(
                                    <TableRow key={idx}>
                                        <TableCell>{itm.name}</TableCell>
                                        <TableCell>{itm.ids}</TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-[65%] p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, price: +e.target.value, hasChanges: true} : {...i}) ))}} type="number" value={itm.price} />
                                        </TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-[65%] p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, on_sale_price: +e.target.value, hasChanges: true} : {...i}) ))}} type="number" value={itm.on_sale_price} />
                                        </TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-[65%] p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, stock: +e.target.value, hasChanges: true} : {...i}) ))}} type="number" value={itm.stock} />
                                        </TableCell>
                                        <TableCell className="py-0">
                                            <Select onValueChange={(v) => setVariants(variants.map((i) => (i.id === itm.id ? {...i, is_on_sale: +v, hasChanges: true}:{...i})))} value={itm.is_on_sale.toString()}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">True</SelectItem>
                                                    <SelectItem value="0">False</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        {/* <TableCell>{itm.on_sale_price}</TableCell> */}
                                        {/* <TableCell>{itm.stock}</TableCell> */}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={submit}>Save and Publish</Button>
                </CardFooter>
            </Card>
        </div>
        </>
    )
}

export default Variants;