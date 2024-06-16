"use client"
import Header from "@/components/Header";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Gadgets from "@/assets/gadgets.webp";
import Tools from "@/assets/tools.svg";
import Clothes from "@/assets/clothes.png";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import formatPrice from "@/utils/formatPrice";
import { useRouter } from "next/navigation";
import Link from "next/link";

type  Product = {
  category_id: number
  description: string
  id: number
  product_name: string
  thumbnail: string
  min_price: number
  max_price: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const mainElement = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadNewProducts();
  }, [page]);

  async function loadProducts() {
    try {
      const res = await axios("/api/products?limit=10");
      setProducts(res.data);
    } catch (error) {
      console.log(error)
    }
  }
  async function loadNewProducts() {
    try {
      const res = await axios("/api/products/new?page="+page);
      if (res.data.length > 0) {
        setNewProducts(res.data);
      } else {
        setPage(page - 1);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header/>
      <main className="w-screen overflow-hidden">
        <div className="w-full h-screen grid place-items-center">
            <div className="grid place-items-center space-y-6">
              <h1 className="text-4xl text-center w-[80%] font-medium">With every click, our cart fill up with joy and anticipation, here on ShopEase!</h1>
              <Link href="#ms">
                <Button className="rounded-full px-10">Shop Now</Button>
              </Link>
            </div>
        </div>

        <div id="ms" className="w-full min-h-[50vh] bg-primary/[0.03] flex justify-center">
          <div className="w-full max-w-[1200px] py-20">
            <div className="p-4 flex justify-between">
              <h1 className="text-xl font-medium tracking-wide">New Arrivals</h1>
              <div className="space-x-2">
                <Button onClick={() => setPage(page > 0 ? page - 1 : page)} variant={page > 0 ? "default" : "outline"} className="rounded-full px-3">
                  <ArrowLeft className="w-4 h-4"/>
                </Button>
                <Button onClick={() => setPage(page + 1)} className="rounded-full px-3">
                  <ArrowRight className="w-4 h-4"/>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4">
              {newProducts.map((i, id) => (
                <div onClick={() => router.push("/product/"+i.id)} key={id} className="bg-background h-full w-full col-span-1 p-4 rounded-lg shadow-sm py-6">
                  <div className="w-full h-[85%] p-2 overflow-hidden">
                    <img className="object-cover" alt="sd" src={i.thumbnail}/>
                  </div>
                  <h1>{i.product_name}</h1>
                  {/* <div className="flex gap-[2px]">
                    <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                    <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                    <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                    <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                    <Star className="w-3 text-yellow-400 "/>
                    <span className="text-xs mt-1 text-muted-foreground">{"(3)"}Reviews</span>
                  </div> */}
                  <h1 className="text-primary font-semibold">{formatPrice(i.min_price)}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full min-h-[50vh] flex justify-center p-4">
          <div className="w-full max-w-[1200px] py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-[16/8] sm:aspect-[12/3] border rounded-lg col-span-1 sm:col-span-2 p-8 py-16 space-y-3 relative">
                <h1 className="text-2xl tracking-wide text-foreground/80">Empowering Your Tech Lifestyle..</h1>
                <p className="w-[90%] sm:w-[50%] text-foreground/70 pb-4">
                  Discover innovative gadgets designed to enhance your lifestyle with advanced technology and smart features.
                </p>
                <div className="h-[180%] hidden md:block aspect-square absolute -right-20 -top-10">
                  <Image src={Gadgets || ""} alt="" objectFit="true"/>
                </div>
                <Button onClick={() => router.push("/products?cat=gadgets")} className="rounded-full px-6">Explore Gadgets <ArrowRight className="w-5 ml-3"/></Button>
              </div>
              <div className="aspect-[16/8] border border-primary/70 rounded-lg col-span-1 p-8 py-16 space-y-3 relative">
                <h1 className="text-2xl tracking-wide text-foreground/80">Crafted for Excellence.</h1>
                <p className="w-[90%] sm:w-[65%] text-foreground/70 pb-4">
                  Discover a range of reliable, high performance tools designed to meet the needs of professional bulders.
                </p>
                <Button onClick={() => router.push("/products?cat=tools")} className="rounded-full px-6">Explore Tools <ArrowRight className="w-5 ml-3"/></Button>
                <div className="h-[110%] hidden md:block aspect-square absolute -right-12 top-5">
                  <Image src={Tools || ""} alt="" objectFit="true"/>
                </div>
              </div>
              <div className="aspect-[16/8] rounded-lg bg-primary/30 col-span-1 p-8 py-16 space-y-3 relative">
                <h1 className="text-2xl tracking-wide text-foreground/80">Find  Your Perfect Fit.</h1>
                <p className="w-[90%] sm:w-[65%] text-foreground/70 pb-4 relative z-10">
                  Discover stylish, high-quality clothing designed for comfort and elegance, perfect for every occasion.
                </p>
                <Button onClick={() => router.push("/products?cat=clothes")} className="rounded-full px-6">Explore Clothes <ArrowRight className="w-5 ml-3"/></Button>
                <div className="h-[90%] hidden md:block aspect-square absolute -right-2 top-2 -z-0">
                  <Image src={Clothes || ""} alt="" objectFit="true"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-h-[50vh] bg-primary/[0.03] flex justify-center">
          <div className="w-full max-w-[1200px] py-20">
          <Tabs defaultValue="register">
            <div className="p-4 flex justify-between">
              <h1 className="text-xl font-medium tracking-wide">Products</h1>
              <div className="space-x-2">
                <TabsList className="grid w-full grid-cols-2 rounded-full">
                    <TabsTrigger className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-accent" value="register">All</TabsTrigger>
                    <TabsTrigger className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-accent" value="login">Popular</TabsTrigger>
                </TabsList>
              </div>
            </div>
            <TabsContent value="register">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4">
                {products?.map((i, id) => (
                  <div onClick={() => router.push("/product/"+i.id)} key={id} className="bg-background/70 h-full w-full col-span-1 p-4 rounded-lg shadow-sm py-6">
                    <div className="w-full h-[85%] p-2 overflow-hidden">
                      <img className="object-cover" alt="sd" src={i.thumbnail}/>
                    </div>
                    <h1>{i.product_name}</h1>
                    {/* <div className="flex gap-[2px]">
                      <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                      <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                      <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                      <Star className="w-3 text-yellow-400 fill-yellow-400"/>
                      <Star className="w-3 text-yellow-400 "/>
                      <span className="text-xs mt-1 text-muted-foreground">{"(3)"}Reviews</span>
                    </div> */}
                    <h1 className="text-primary font-semibold">{formatPrice(i.min_price)}</h1>
                  </div>
                ))}
              </div>
            </TabsContent>
            </Tabs>
            <div className="w-full flex justify-center">
              <Button onClick={() => router.push("/products")} variant="link">Explore Products</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
