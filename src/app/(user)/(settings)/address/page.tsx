

"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
export default function Password(){
    const {user} = useUserStore();

    // async function update() {
        
    // }

    return(
        <div className="">
            <h1 className="text-xl font-bold">Address</h1>
            <h3 className="text-muted-foreground">Manage your shipping address/billing address.</h3>
            <Separator className="my-4"/>
            <div className="w-full flex">
                <div className="w-[60%] pr-4">
                    <h1 className="font-bold">List</h1>
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell className="font-medium">INV001</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right">$250.00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="w-[40%] space-y-2">
                    <h1 className="font-bold text-md">New Address</h1>
                    <div className="max-w-xl">
                        <Label>Fullname</Label>
                        <Input placeholder="Enter fullname"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Mobile number</Label>
                        <Input placeholder="Enter mobile number"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>House/Unit/Flr #, Bldg Name</Label>
                        <Input placeholder="Enter House/Unit/Flr #, Bldg Name"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Province</Label>
                        <Input placeholder="Enter province"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>City/Municipality</Label>
                        <Input placeholder="Enter City/Municipality"/>
                    </div>
                    <div className="max-w-xl">
                        <Label>Barangay</Label>
                        <Input placeholder="Enter barangay"/>
                    </div>
                    <div className="pt-4 flex gap-2">
                        <Button variant="outline">Back to Home</Button>
                        <Button>Add</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}