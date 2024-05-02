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
  
type Variant = {
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
            setVariants(res.data);
        } catch (error) {
            
        }
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
                                <TableHead className="w-20">Preview</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>IDs</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>On Sale Price</TableHead>
                                <TableHead>Stocks</TableHead>
                                <TableHead>On Sale</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {variants.map((itm, idx) => {
                                return(
                                    <TableRow key={idx}>
                                        <TableCell>{itm.preview || "null"}</TableCell>
                                        <TableCell>{itm.name}</TableCell>
                                        <TableCell>{itm.ids}</TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-1/2 p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, price: +e.target.value} : {...i}) ))}} type="number" value={itm.price} />
                                        </TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-1/2 p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, on_sale_price: +e.target.value} : {...i}) ))}} type="number" value={itm.on_sale_price} />
                                        </TableCell>
                                        <TableCell className="w-48">
                                            <input className="w-1/2 p-1" onChange={(e) => {setVariants(variants.map((i) => (i.id === itm.id ? {...i, stock: +e.target.value} : {...i}) ))}} type="number" value={itm.stock} />
                                        </TableCell>
                                        <TableCell>{itm.is_on_sale}</TableCell>
                                        {/* <TableCell>{itm.on_sale_price}</TableCell> */}
                                        {/* <TableCell>{itm.stock}</TableCell> */}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button>Save and Publish</Button>
                </CardFooter>
            </Card>
        </div>
        </>
    )
}

export default Variants;