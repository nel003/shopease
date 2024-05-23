"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CircleX, Plus, PlusCircle, PlusIcon } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { useParams, useRouter } from "next/navigation";
  

type CategoryType = {
    id: number
    category: string
    description: string
}

type Product = {
    id: number
    product_name: string
    thumbnail: string
    category_id: number
    description: string
    status: number
}

function EditProduct() {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imgData, setImgData] = useState<string | undefined>();
    const [previewsData, setPreviewsData] = useState<any[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [product, setProduct] = useState<Product>();

    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        loadDetails();
        loadCategories();
    }, []);
    
    useEffect(() => {
        setProductName(product?.product_name || "");
        setCategory(product?.category_id?.toString() || "");
        setDescription(product?.description || "");
        setImgData(product?.thumbnail || "");
    }, [product]);

    async function loadDetails() {
        try {
            const res = await axios({
                method: "GET",
                url: "/api/admin/product/"+id
            });
            setProduct(res.data.product);
            setPreviewsData(res.data.previews);
        } catch (error) {
            
        }
    }

    async function loadCategories() {
        try {
            const res = await axios({
                url: '/api/admin/categories',
                method: 'GET'
            });
            setCategories(res.data);
        } catch (error: any) {
            toast("Failed to load categories", {
                description: "Server error.",
                closeButton: true
            });
        }
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement>) {
        const target = e.target as HTMLButtonElement;
        target.disabled = true;
        target.innerText = "Processing..."
        try {
            const res = await axios({
                url: "/api/admin/product/"+id,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({productName, category, description})
            });
            router.push("/admin/products/new/variants/"+id);
        } catch (error) {
            
        }
        target.disabled = false;
        target.innerText = "Next"
    }
 
    return(
        <div className="p-5">
            <div className="w-full flex gap-5">
                <div className="w-[70%]">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            {/* <h4 className="leading-none text-xl font-bold">Edit product</h4> */}
                        </div>
                    <div className="space-y-2">
                        <div className="">
                        <Label htmlFor="productname">Product Name</Label>
                        <Input
                            id="productname"
                            onChange={(e) => setProductName(e.target.value)}
                            value={productName}
                            placeholder="Enter product name"
                        />
                        </div>
                        <div className="">
                        <Label htmlFor="Category">Category</Label>
                        <Select onValueChange={(v) => setCategory(v)} value={category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((itm, idx) => {
                                    return(
                                        <SelectItem key={idx} value={itm.id.toString()}>{itm.category}</SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            placeholder="Enter product  description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                        ></Textarea>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="File">Thumbnail</Label>
                            <Label className="aspect-square w-[20%] border rounded-lg grid place-items-center relative overflow-hidden p-2" htmlFor="File">
                                <img className="object-fill" src={imgData || ""} alt=""/>
                            </Label>
                        </div>
                    </div>
                        <div>
                            <Label htmlFor="previews">Previews</Label>
                            <div className="grid gap-4 grid-cols-8 pr-10 pb-4">
                                {previewsData.map((itm, idx) => {
                                    return(
                                        <div key={idx} className="aspect-square w-full border rounded-lg grid place-items-center relative p-2">
                                            <img className="object-fill" src={itm?.url_path || ""} alt=""/>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                    <Button onClick={() => router.push("/admin/products")} variant="outline" className="w-1/4 max-w-[200px]">Cancel</Button>
                    <Button onClick={submit} disabled={!productName.trim() || !category.trim() || !description.trim()} className="w-1/4 max-w-[200px]">Next</Button>
                </div>
        </div>
    )
}

export default EditProduct;