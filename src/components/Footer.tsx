import { Button } from "./ui/button";
import { Input } from "./ui/input";


export default function Footer() {
    return(
        <div className="w-full h-auto min-h-72 relative overflow-hidden bg-primary/[0.03] flex justify-center">
          <div className="absolute w-[120%] h-[100%] -left-[5%] top-[13%] rotate-2 bg-primary"></div>
          <div className="h-auto w-full max-w-[1200px] top-0 left-0 text-accent z-10">
            <div className="p-4 pt-28 sm:pt-20 flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-[35%]">
                    <h1 className="text-xl font-semibold">ShopEase</h1>
                    <p className="w-[95%] text-sm text-muted ">
                        Discover the ease of online shopping with Shopease, where quality, variety, and customer satisfaction come together. Shop with confidence and enjoy the convenience of finding everything you need in one place.
                    </p>
                </div>
                <div className="w-full md:w-[35%]">
                    <h1 className="text-md font-semibold">Company</h1>
                    <ul>
                        <li><a className="text-sm text-muted" href="#">About Us</a></li>
                        <li className="text-sm text-muted">Pagadian City</li>
                        <li className="text-sm text-muted">customer.service@shopease.com</li>
                        <li className="text-sm text-muted">+(63) 937-8462-747</li>
                    </ul>
                </div>
                <div className="w-full md:w-[35%]">
                    <h1 className="text-md font-semibold">Subcribe to our Newsletter</h1>
                    <div className="relative">
                        <Input className="rounded-full text-foreground pr-24" placeholder="Email address"/>
                        <Button className="rounded-full absolute top-1 right-1 h-8">Subcribe</Button>
                    </div>
                </div>
            </div>
            <div className="w-full border-t text-center py-5 text-xs">
                ©2024 ShopEase. Made on Earth by Humans
            </div>
          </div>
        </div>
    )
}