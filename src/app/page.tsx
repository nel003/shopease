import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Header/>
      <main className="w-screen flex justify-center">
        <div className="wrapper w-[1200px] h-screen p-4 grid place-items-center">
          <div className="grid place-items-center space-y-6">
            <h1 className="text-4xl text-center w-[80%] font-medium">With every click, our cart fill up with joy and anticipation, here on ShopEase!</h1>
            <Button className="rounded-full px-10">Shop Now</Button>
          </div>
        </div>
      </main>
    </>
  );
}
