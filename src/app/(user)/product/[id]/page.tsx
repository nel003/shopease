"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { ChevronRight, Minus, Plus, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import formatPrice from "@/utils/formatPrice";
import { title } from "process";

type Entry = {
    id: number
    ids: string
    preview: string
    name: string
    price: number
    on_sale_price: number
    is_on_sale: number
    stock: number
    product_id: number
}

type  Product = {
    category_id: number
    description: string
    id: number
    product_name: string
    thumbnail: string
    min_price: number
    max_price: number
    files: {
        url_path: string,
        id: number
    }[]
    variants: any
    entries: Entry[]
}

export default function Product() {
    const { toast } = useToast();
    const params = useParams();
    const [product, setProduct] = useState<Product>();
    const id = params.id;
    const {user} = useUserStore();
    const router = useRouter();

    const [active, setActive] = useState("");
    const [selectedVariant, setSelectedVariant] = useState<any>({});

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [selectedInd, setSelectedInd] = useState("");
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        const values = Object.values(selectedVariant).join("-");
        const f = product?.entries.find(i => (i.ids === values));
        if (f?.stock === 0) {
            toast({
                title: "Failed",
                description: "Out of stock."
            });
            return;
        }
        if (f) {
            setPrice(formatPrice(f.price));
            setSelectedInd(f.name);
            setDisabled(false);
        }
    }, [selectedVariant]);
    
    useEffect(() => {
        loadProductDetail();
    }, []);

    useEffect(() => {
        if (!api) {
          return
        }
     
        setCount((product?.files.length || 0) + 1)
        setCurrent(api.selectedScrollSnap() + 1)
     
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1)
        })
      }, [api, product])

    function hasStock(key: string, value: string) {
        const cp = {...selectedVariant};
        cp[key] = value;
        const values = Object.values(cp).join("-");
        const f = product?.entries.find(i => (i.ids === values))
        if (!f) {
            return true;
        }
        if (f?.stock === 0) {
            return false;
        }
        return true;
    }

    async function loadProductDetail() {
        try {
            const res = await axios({
                method: "GET",
                url: "/api/product/"+id
            });
            setProduct(res.data)
            setActive(res.data.thumbnail);

            const initVar: any = {};
            Object.keys(res.data.variants).forEach((e: any) => {
                initVar[e] = [];
            });
            setSelectedVariant(initVar);
            setPrice(res.data?.min_price !== res.data?.max_price ? formatPrice(res.data?.min_price || 0) +" - "+ formatPrice(res.data?.max_price || 0):formatPrice(res.data?.min_price || 0));
            setDisabled((res.data?.entries.length || 0) > 1 ? true : false);
        } catch (error) {
            console.log(error)
        }
    }

    async function addToCart() {
        try {
            if (!user) {
                router.push("/account");
                return;
            }

            const values = Object.values(selectedVariant).join("-");
            const f = product?.entries.find(i => (i.ids === values));
            
            await axios({
                url: "/api/user/cart",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({product_entry_id: product?.entries && product?.entries.length > 1 ? f?.id : product?.entries[0].id , quantity, product_id: id})
            });
            toast({
                title: "Success",
                description: "Added to cart"
            });
        } catch (error) { 
            toast({
                title: "Failed",
                description: "Server error."
            });
        }
    }
    
    return(
        <>
        <Header/>
        <main className="w-screen overflow-hidden">
            <div className="w-full min-h-[95vh] bg-primary/[0.03] flex justify-center">
                <div>
                <div className="w-full max-w-[1200px] my-20 flex flex-col md:flex-row gap-0 md:gap-6 bg-white rounded-md p-4 md:pt-10 md:px-10">
                    <div className="w-full md:w-[45%]">
                        <Carousel setApi={setApi} className="mx-auto w-full md:w-[80%]">
                            <CarouselContent>
                                <CarouselItem>
                                    <div onClick={() => setActive(product?.thumbnail || "")} className="h-full aspect-square relative rounded-md overflow-hidden">
                                        <img className="object-cover" src={product?.thumbnail} alt="#" />
                                    </div>
                                </CarouselItem>
                                {product?.files.map((it, id) => (
                                    <CarouselItem key={id}>
                                        <div className="w-full aspect-square relative grid place-items-center rounded-md overflow-hidden">
                                            <img className="object-cover object-center aspect-square" src={it.url_path} alt="#" />
                                        </div>  
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="py-2 text-center text-sm text-muted-foreground">
                            Slide {current} of {count}
                        </div>
                    </div>
                    <div className="w-full md:w-[60%] pb-4">
                        <div className="pb-6 block md:hidden">
                            <div>
                                <h1 className="text-2xl py-4 font-semibold text-primary">{product?.min_price !== product?.max_price ? formatPrice(product?.min_price || 0) +" - "+ formatPrice(product?.max_price || 0):formatPrice(product?.min_price || 0)}</h1>
                            </div>
                            <h1 className="text-lg font-medium">{product?.product_name} Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h1>
                            <div className="flex gap-[2px]">
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 "/>
                                <span className="text-xs mt-1 text-muted-foreground">4/5 {"(3)"}</span>
                            </div>
                        </div>
                        <div className="pb-6 hidden md:block">
                            <h1 className="text-lg font-medium">{product?.product_name} Lorem ipsum dolor, sit amet consectetur adipisicing elit.</h1>
                            <div className="flex gap-[2px]">
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                                <Star className="w-3 text-yellow-400 "/>
                                <span className="text-xs mt-1 text-muted-foreground">4/5 {"(3)"}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl py-4 font-semibold text-primary">{price}</h1>
                            </div>
                        </div>
                        <div className="space-y-2 hidden md:block">
                            {Object.keys(product?.variants || {}).map((it, id) => (
                                <div className="flex gap-2 flex-col" key={id}>
                                    <div className="min-w-16 text-sm text-muted-foreground">{it}</div>
                                    <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {product?.variants[it].map((iit:any, iid:any) => {
                                            const h = hasStock(it, iit.option_id);
                                            return(
                                            <Button variant="outline" onClick={() => {
                                                const v: any = {...selectedVariant};
                                                v[it] = iit.option_id
                                                setSelectedVariant(v);
                                            }} 
                                            disabled={!h}
                                            className={`p-1 text-sm border h-8 rounded-md w-full cursor-pointer text-center ${selectedVariant[it] == iit.option_id ? "border-primary text-primary":"border-foreground-muted text-foreground"}`} key={iid}>{iit.variant_option}</Button>
                                        )})}
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-2 flex-col">
                                <div className="min-w-16 text-sm text-muted-foreground">Quantity</div>
                                <div className="flex gap-1">
                                    <Button variant="outline" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)} className="p-1 h-8 w-8"><Minus className="w-4"/></Button>
                                    <Input className="p-1 h-8 text-center w-14" onChange={(e) => setQuantity(+e.target.value)} value={quantity}/>
                                    <Button variant="outline" onClick={() => setQuantity(quantity + 1)} className="p-1 h-8 w-8"><Plus className="w-4"/></Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full md:hidden">
                            <h1 className="text-sm text-muted-foreground">Product Options</h1>
                            <h1 className="text-sm">{Object.keys(product?.variants || {}).join(", ")}</h1>
                            <div className="grow flex justify-end">
                                <ChevronRight className=" h-4 mt-[2px]"/>
                            </div>
                        </div>
                        <div className="gap-4 w-full pt-8 sticky left-0 top-[100vh] hidden md:flex">
                            <Button onClick={() => console.log(user)} className="w-full" variant="outline">Cancel</Button>
                            <Button disabled={disabled} onClick={addToCart} className="w-full">Add to Cart</Button>
                        </div>
                        {/* Mobile */}
                        <div className="flex md:hidden gap-4 w-full pt-8 sticky left-0 top-[100vh]">
                            <Button className="w-full" variant="outline">Cancel</Button>   
                            <Drawer>
                                <DrawerTrigger className="w-full" asChild>
                                    <Button className="w-full">Add to Cart</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <div className="mx-auto w-full max-w-md">
                                    <DrawerHeader>
                                        <div className="w-full border-b pb-2 flex gap-2">
                                            <div className="h-24 aspect-square relative rounded-md overflow-hidden">
                                                <img src={product?.thumbnail} className="object-cover" alt="#" />
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <h1 className="text-2xl font-semibold text-primary">{price}</h1>
                                                <h2 className="p-0 text-left text-sm text-muted-foreground">{selectedInd}</h2>
                                            </div>
                                        </div>
                                    </DrawerHeader>
                                    <DrawerFooter>
                                        <div className="space-y-2">
                                            {Object.keys(product?.variants || {}).map((it, id) => (
                                                <div className="flex gap-2 flex-col" key={id}>
                                                    <div className="min-w-16 text-sm text-muted-foreground">{it}</div>
                                                    <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-2">
                                                        {product?.variants[it].map((iit:any, iid:any) => {
                                                            const h = hasStock(it, iit.option_id);
                                                            return(
                                                            <Button variant="outline" onClick={() => {
                                                                const v: any = {...selectedVariant};
                                                                v[it] = iit.option_id
                                                                setSelectedVariant(v);
                                                            }} 
                                                            disabled={!h}
                                                            className={`p-1 text-sm border h-8 rounded-md w-full cursor-pointer text-center ${selectedVariant[it] == iit.option_id ? "border-primary text-primary":"border-foreground-muted text-foreground"}`} key={iid}>{iit.variant_option}</Button>
                                                        )})}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex gap-2 flex-col">
                                                <div className="min-w-16 text-sm text-muted-foreground">Quantity</div>
                                                <div className="flex gap-1">
                                                    <Button variant="outline" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)} className="p-1 h-8 w-8"><Minus className="w-4"/></Button>
                                                    <Input className="p-1 h-8 text-center w-14" onChange={(e) => setQuantity(+e.target.value)} value={quantity}/>
                                                    <Button variant="outline" onClick={() => setQuantity(quantity + 1)} className="p-1 h-8 w-8"><Plus className="w-4"/></Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full pt-8">
                                            <Button disabled={disabled} onClick={addToCart} className="w-full">Confirm</Button>
                                        </div>
                                    </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                    </div>
                    <div className="p-4 bg-white">
                        <h1 className="text-lg">Product description</h1>
                        <p>{product?.description}</p>
                    </div>
                </div>
            </div>
        </main>
        <Footer/>
        </>
    )
}