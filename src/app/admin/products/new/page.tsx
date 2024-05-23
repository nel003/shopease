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
import { useRouter } from "next/navigation";
  

type CategoryType = {
    id: number
    category: string
    description: string
}

type Variants = {
    name: string,
    values: string[]
}

function NewProduct() {
    const [productName, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [imgData, setImgData] = useState<string | undefined>();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previews, setPreviews] = useState<File[]>([]);
    const [previewsData, setPreviewsData] = useState<string[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    
    const [variants, setVariants] = useState<Variants[]>([]);
    const [newVariant, setNewVariant] = useState("");
    const [variantValue, setVariantValue] = useState<any>({});

    const router = useRouter();

    useEffect(() => {
        loadCategories();
    }, []);

    async function imgBaseUrl(file: File, next: React.Dispatch<React.SetStateAction<string | undefined>>) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            next(reader.result?.toString())
        }
        reader.readAsDataURL(file);
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

    function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setThumbnail(e.target.files[0]);
            imgBaseUrl(e.target.files[0], setImgData);
        }
    }
    function handlePreviewChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const newp = [...previews];
            newp.push(e.target.files[0])
            setPreviews(newp);

            const reader = new FileReader();
            reader.onloadend = async () => {
                const img = reader.result?.toString() || "";
                const imgNewData = [...previewsData];
                imgNewData.push(img);
                setPreviewsData(imgNewData);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function pushVariant() {
        const vars: any = [...variants];
        vars.push({name: newVariant, values: []});
        setVariants(vars);
        setNewVariant("");
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement>) {
        const target = e.target as HTMLButtonElement;
        target.disabled = true;
        target.innerText = "Processing..."
        try {
            const FD = new FormData();
            FD.append("productName", productName);
            FD.append("category", category);
            FD.append("description", description);
            FD.append("thumbnail", thumbnail || "");
            FD.append("variants", JSON.stringify(variants));
            for(const i in previews) {
                FD.append("previews[]", previews[i] || ""); 
            }
            const res = await axios({
                url: "/api/admin/products/new",
                method: "POST",
                headers: {
                    "Content-Type": "multipart//form-data"
                },
                data: FD
            });
            
            router.push("/admin/products/new/variants/"+res.data.id);
        } catch (error) {
            
        }
        target.disabled = false;
        target.innerText = "Next"
    }

    function handleVariantValue(name: string) {
        const vars = variants.map((i) => {
            if (name === i.name) {
                i.values.push(variantValue[name]);
            }
            return i;
        });
        
        setVariants(vars);
        setVariantValue({});
    }
 
    return(
        <div className="p-5">
            <div className="w-full flex gap-5">
                <div className="w-[70%]">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="leading-none text-xl font-bold">Add new product</h4>
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
                                <img className={`object-fill ${thumbnail ? "block" : "hidden"}`} src={imgData || ""} alt=""/>
                                <PlusIcon className={`w-8 text-foreground/50 ${thumbnail ? "hidden":"block"}`}></PlusIcon>
                            </Label>
                            <Input
                                id="File"
                                name="thumbnail"
                                type="file"
                                onChange={handleThumbnailChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                        <div>
                            <Label htmlFor="previews">Photos</Label>
                            <div className="grid gap-4 grid-cols-8 pr-10 pb-4">
                                {previewsData.map((itm, idx) => {
                                    return(
                                        <div key={idx} className="aspect-square w-full border rounded-lg grid place-items-center relative p-2">
                                            <div className="w-4 h-4 rounded-full absolute -right-2 -top-2">
                                                <CircleX onClick={() => {
                                                    setPreviews(previews.filter((i, d) => (idx !== d)));
                                                    setPreviewsData(previewsData.filter((i, d) => (idx !== d)));
                                                }} className="w-4"></CircleX>
                                            </div>
                                            <img className={`object-fill ${previews ? "block" : "hidden"}`} src={itm || ""} alt=""/>
                                        </div>
                                    )
                                })}
                                <Label className={`aspect-square w-full border rounded-lg place-items-center relative overflow-hidden p-2 ${previews.length > 3 ? "hidden":"grid"}`} htmlFor="previews">
                                    <PlusIcon className={`w-8 text-foreground/50 ${previews.length > 3 ? "hidden":"block"}`}></PlusIcon>
                                </Label>
                                <Input
                                    id="previews"
                                    name="thumbnail"
                                    type="file"
                                    onChange={handlePreviewChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                </div>
                </div>
                <div className="w-[30%]">
                    <div className="space-y-2 mb-4">
                        <h4 className="leading-none text-xl font-bold">Variants</h4>
                        <p className="text-xs">Please carefully check your inputs, you can't modify if saved.</p>
                    </div>
                    <div className="space-y-4">
                        {variants.map((itm, idx) => {
                            return(
                                <div key={idx} className="py-2 px-3 w-62 border rounded-lg text-xs font-semibold space-y-4">
                                    <div className="flex">
                                        <span className="grow">{itm.name}</span>  
                                        <CircleX onClick={() => setVariants(variants.filter((i, d) => (d !== idx)))} className="w-4 h-4"></CircleX>
                                    </div>
                                    <div className="space-y-2">
                                        {itm.values.map((it, idx) => {
                                            return(
                                                <Input key={idx} type="text" disabled value={it}/>
                                            )
                                        })}
                                        <div className="flex gap-2">
                                            <Input className="font-medium" onChange={(e) => {
                                                const cp = {...variantValue};
                                                cp[itm.name] = e.target.value;
                                                setVariantValue(cp);
                                            }} value={variantValue[itm.name] || ""} placeholder="Variant value"/>
                                            <Button onClick={() => handleVariantValue(itm.name)} disabled={!variantValue[itm.name]} className="w-12 px-0" variant="outline"><Plus className="w-4"/></Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className={`${variants.length >= 3 ? "hidden" : "block"}`}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="py-2 px-4 border rounded-lg text-xs font-semibold flex w-20 cursor-pointer">
                                        <span className="grow">Add</span> 
                                        <PlusCircle className="w-4 h-4"/>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <h1 className="text-md font-semibold pb-4">New variant</h1>
                                    <Input onChange={(e) => setNewVariant(e.target.value)} value={newVariant} placeholder="Variant name"/>
                                    <PopoverClose asChild>
                                        <Button onClick={pushVariant} disabled={newVariant === ""} className="mt-5 w-full">Add</Button>
                                    </PopoverClose>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
                    <Button onClick={() => router.push("/admin/products")} variant="outline" className="w-1/4 max-w-[200px]">Cancel</Button>
                    <Button onClick={submit} disabled={!thumbnail || !productName.trim() || !category.trim() || !description.trim()} className="w-1/4 max-w-[200px]">Next</Button>
                </div>
        </div>
    )
}

export default NewProduct;