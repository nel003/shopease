"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import formatPrice from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

type  Product = {
    category_id: number
    description: string
    id: number
    product_name: string
    thumbnail: string
    min_price: number
    max_price: number
  }

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();
    const params = useSearchParams();

    const cat = params.get("cat") || "";
    const search = params.get("search") || "";

    useEffect(() => {
      function handleScroll() {
        if(window.innerHeight + document.documentElement.scrollTop === document.scrollingElement?.scrollHeight) {
          loadMoreProducts();
        }
      }

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [page]);

    useEffect(() => {
      loadProducts();
    }, [cat, search]);
    
    async function loadProducts() {
      try {
          const res = await axios("/api/products?page=0&cat="+cat+"&search="+search);
          setProducts(res.data);
      } catch (error) {
        console.log(error)
      }
    }

    async function loadMoreProducts() {
      try {
        if (!isLoading && hasMore) {
          setIsLoading(true);
          const res = await axios("/api/products?page="+page+"&search="+search);
          if (res.data.length > 0) {
            setProducts([...products, ...res.data]);
            setPage(page => page + 1);
          } else {{
            setHasMore(false);
          }}
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false);
      }
    }
    
    return(
        <>
        <Header/>
        <main className="w-screen overflow-hidden min-h-screen">
            <div className="w-full min-h-[50vh] bg-primary/[0.03] flex justify-center">
                <div className="w-full max-w-[1200px] py-20">
                    <div className="p-4 flex justify-between">
                    <h1 className="text-xl font-medium tracking-wide text-center w-full">Products</h1>
                    <div className="space-x-2">
                        
                    </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4">
                    {products.map((i, id) => (
                      <div onClick={() => router.push("/product/"+i.id)} key={id} className="bg-background h-full w-full col-span-1 p-4 rounded-lg shadow-sm py-6">
                        <div className="w-full aspect-square h-[85%] p-2 overflow-hidden">
                            <img className="object-cover object-center aspect-square" alt="sd" src={i.thumbnail}/>
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

        </main>
        <Footer/>
        </>
    )
}

{/* <div key={id}>
  <Drawer>
  <DrawerTrigger className="w-full">
    
  </DrawerTrigger>
  <DrawerContent>
    <div className="mx-auto w-full max-w-md">
      <DrawerHeader>
        <DrawerTitle>Add to cart</DrawerTitle>
      </DrawerHeader>
      <DrawerFooter>
        <div className="w-full flex gap-4 flex-col sm:flex-row">
          <div className="w-full sm:w-[55%] aspect-square bg-black space-y-2">
            <div className="h-[85%] w-full relative p-2">
              <img className="object-cover" src={i.thumbnail} alt="#" />
            </div>
            <div className="h-[15%]">
              <div className="h-full relative">
                <img className="object-cover" src="" alt="#" />
              </div>
            </div>
          </div>
          <div className="w-full sm:w-[45%] aspect-auto h-auto sm:aspect-square bg-red-400">
            <h1>sdd</h1>
          </div>
        </div>
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>
</div> */}