"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Boxes, Package, PenLine, Plus, PlusIcon, Trash2, TrendingUp, Users } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; 
import axios from "axios";
import { toast } from "sonner"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
  
type ProductType = {
    id: number
    category_id: number
    status: number
    product_name: string
    thumbnail: string
    category: string
    description: string
    checked: boolean
}

function Products() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<ProductType[]>([]);
    const [debounce] = useDebounce(search, 300);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, [debounce]);

    async function loadProducts() {
        try {
            const res = await axios({
                url: "/api/admin/products",
                method: "GET"
            });
            const newData = res.data.map((i: ProductType) => ({...i, checked: false}));
            setProducts(newData);
        } catch (error: any) {
            toast("Failed to load products", {
                description: "Server error.",
                closeButton: true
            });
        }
    }
    console.log(products)
    
    async function del(many: boolean, id: number) {
        try {
            let data = {};
            if (many) {
                const ids = products.filter((c) => (c.checked)).map((i) => (i.id));
                data = {many: true, id: ids}
            } else {
                data = {many: false, id}
            }
            await axios({
                url: "/api/admin/products",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data)
            });
            loadProducts();
        } catch (error) {
            
        }
    }
    console.log(products)

    return(
      <>
        <div className="w-full">
          <h1 className="text-3xl font-bold p-4 px-5">Dashboard</h1>
          <div className="w-full p-5 flex gap-4">
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Products</CardTitle>
                        <CardDescription>Manage products</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="mb-1 flex gap-1">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline"><Trash2 className="w-4 text-red-300"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete selected categories?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the data from the servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => del(true, 0)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <div>
                            <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..."/>
                        </div>
                        <span className="grow"></span>
                        <div>
                            <Button onClick={() => router.push("/admin/products/new")} variant="outline"><Plus className="w-4"/> New Product</Button>
                        </div>
                    </div>
                    <div className="border rounded-lg">
                        <Table>
                            <TableCaption>A list of products.</TableCaption>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-7">
                                    <Checkbox onCheckedChange={(c: boolean) => setProducts(products.map((i) => ({...i, checked: c})))}/>
                                </TableHead>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Product name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[140px]">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((itm, idx) => {
                                    return(
                                        <TableRow key={idx}>
                                            <TableCell className="absolute">
                                                <Checkbox onCheckedChange={(c: boolean) => setProducts(products.map((i) => (i.id === itm.id ? {...i, checked: c}:{...i})))} checked={itm.checked}/>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4">
                                                    <img className="h-full" alt="preview" src={itm.thumbnail}/>
                                                </div>
                                            </TableCell>
                                            <TableCell>{itm.product_name}</TableCell>
                                            <TableCell>{itm.category}</TableCell>
                                            <TableCell>{itm.description}</TableCell>
                                            <TableCell>{itm.status}</TableCell>
                                            <TableCell className="py-0 space-x-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild> 
                                                        <Button className="mt-1 h-8" variant="outline"><Trash2 className="w-4"/></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete `{itm.product_name}`?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the data from the servers.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => del(false, itm.id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button className="mt-1 h-8"><PenLine className="w-4"/></Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="end" className="w-80">
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium leading-none">Modify `{itm.category}` category</h4>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="">
                                                                <Label htmlFor="Category">Category</Label>
                                                                <Input
                                                                    id="Category"
                                                                    placeholder="Enter category"
                                                                />
                                                                </div>
                                                                <div className="">
                                                                <Label htmlFor="description">Description</Label>
                                                                <Textarea 
                                                                    placeholder="Enter category description"
                                                                ></Textarea>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <Button className="w-full">Save changes</Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default Products
;