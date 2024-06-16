

"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
type Address = {
    id: number
    fullname: string
    number: string
    house: string
    province: string
    city: string
    barangay: string
}
  
export default function Password(){
    const {user} = useUserStore();
    const [fullname, setFullname] = useState("");
    const [number, setNumber] = useState("");
    const [house, setHouse] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [barangay, setBarangay] = useState("");
    
    const [targetID, setTargerID] = useState<string | null>(null);

    const [addresses, setAddresses] = useState<Address[]>([]);

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        try {
            const res = await axios.get("/api/user/addresses");
            setAddresses(res.data);
        } catch (error) {
            toast("Failed to load addresses!");
        }
    }
 
    async function add() {
        try {
            await axios({
                url: "/api/user/addresses",
                method: "POST",
                headers: {
                    "Content-Type": "applicaation/json"
                },
                data: JSON.stringify({fullname, number, house, province, city, barangay})
            });
            toast("Address added");
            loadAddresses();
        } catch (error) {
            toast("Server error");
        }
    }
    async function update() {
        try {
            await axios({
                url: "/api/user/addresses",
                method: "PUT",
                headers: {
                    "Content-Type": "applicaation/json"
                },
                data: JSON.stringify({fullname, number, house, province, city, barangay, targetID})
            });
            toast("Address updated");
            loadAddresses();
        } catch (error) {
            toast("Server error");
        }
    }

    async function del(id: number) {
        try {
            await axios({
                url: "/api/user/addresses",
                method: "DELETE",
                headers: {
                    "Content-Type": "applicaation/json"
                },
                data: JSON.stringify({id})
            });
            toast("Address deleted!");
            loadAddresses();
        } catch (error) {
            toast("Server error!");
        }
    }

    function clearFeilds() {
        setFullname("");
        setNumber("");
        setHouse("");
        setProvince("");
        setCity("");
        setBarangay("");
    }

    return(
        <div className="">
            <h1 className="text-xl font-bold">Address</h1>
            <h3 className="text-muted-foreground">Manage your shipping address/billing address.</h3>
            <Separator className="my-4"/>
            <div className="w-full flex">
                <div className="w-[70%] pr-4">
                    <h1 className="font-bold">List</h1>
                    <Table>
                        <TableCaption>A list of your address.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-0">Fullname</TableHead>
                                <TableHead>Phone number</TableHead>
                                <TableHead>House/Unit/Flr #</TableHead>
                                <TableHead>Province</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Barangay</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {addresses.map((it, id) => (
                                <TableRow key={id}>
                                    <TableCell className="pl-0">{it.fullname}</TableCell>
                                    <TableCell>{it.number}</TableCell>
                                    <TableCell>{it.house}</TableCell>
                                    <TableCell>{it.province}</TableCell>
                                    <TableCell>{it.city}</TableCell>
                                    <TableCell>{it.barangay}</TableCell>
                                    <TableCell className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="h-8" variant="outline">Delete</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be undone. This will permanently delete the address.
                                                </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild> 
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild> 
                                                        <Button onClick={() => del(it.id)}>Delete</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

                                        <Button className="h-8" onClick={() => {
                                            setTargerID(it.id.toString());
                                            setFullname(it.fullname);
                                            setNumber(it.number);
                                            setHouse(it.house);
                                            setProvince(it.province);
                                            setCity(it.city);
                                            setBarangay(it.barangay);
                                        }}>Update</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="w-[30%] space-y-2">
                    <h1 className="font-bold text-md">{targetID ? "Update existeng address" : "New Address"}</h1>
                    <div className="max-w-xl">
                        <Label>Fullname</Label>
                        <Input onChange={(e) => setFullname(e.target.value)} value={fullname} placeholder="Enter fullname"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Mobile number</Label>
                        <Input onChange={(e) => setNumber(e.target.value)} value={number} placeholder="Enter mobile number"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>House/Unit/Flr #, Bldg Name</Label>
                        <Input onChange={(e) => setHouse(e.target.value)} value={house} placeholder="Enter House/Unit/Flr #, Bldg Name"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Province</Label>
                        <Input onChange={(e) => setProvince(e.target.value)} value={province} placeholder="Enter province"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>City/Municipality</Label>
                        <Input onChange={(e) => setCity(e.target.value)} value={city} placeholder="Enter City/Municipality"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Barangay</Label>
                        <Input onChange={(e) => setBarangay(e.target.value)} value={barangay} placeholder="Enter barangay"/>
                    </div>
                    <div className="pt-4 flex gap-2">
                        <Button className={`${targetID ? 'block':'hidden'}`} onClick={() => {
                            clearFeilds();
                            setTargerID(null);
                        }} variant="outline">Cancel</Button>
                        <Button className={`${targetID ? 'hidden':'block'}`} onClick={clearFeilds} variant="outline">Clear</Button>
                        <Button disabled={!fullname || !number || !house || !province || !city || !barangay} className={`${targetID ? 'hidden':'block'}`} onClick={add}>Add</Button>
                        <Button onClick={update} disabled={!fullname || !number || !house || !province || !city || !barangay} className={`${targetID ? 'block':'hidden'}`}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}