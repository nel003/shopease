"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PenLine, Trash2 } from "lucide-react";
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
  import { toast } from "sonner"
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce"; 
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
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger,SelectContent, SelectValue } from "@/components/ui/select";

type Customers = {
    checked: boolean
    id: number
    name: string
    username: string
    email: string
    password: null
    gender: string
    birthdate: string
    created_at: string
    status: number
}

function CustomerDashboard() {
    const [customers, setCustomers] = useState<Customers[]>([]);
    const [filter, setFilter] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    // const [month, setMonth] = useState("");
    // const [day, setDay] = useState(0);
    // const [year, setYear] = useState(0);
    const [debounce] = useDebounce(filter, 300);

    useEffect(() => {
        loadCustomers();
    }, [debounce]);

    async function loadCustomers() {
        try {
            const res = await axios({
                url: '/api/admin/customers',
                method: 'GET',
                params: {
                    filter
                }
            });
            const newData = res.data.map((i: Customers) => ({...i, checked: false}));
            setCustomers(newData);
        } catch (error: any) {
            toast("Failed to load customers", {
                description: "Server error.",
                closeButton: true
            });
        }
    }

    async function del(id: number, many: boolean) {
        try {
            if (many) {
                const id = customers.filter(i => (i.checked)).map(i => (i.id));
                const res = await axios({
                    method: 'DELETE',
                    url: '/api/admin/customers',
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    data: JSON.stringify({id, many})
                });
            } else {
                const res = await axios({
                    method: 'DELETE',
                    url: '/api/admin/customers',
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    data: JSON.stringify({id, many})
                });
            }
            toast("Success", {
                description: "Deleted successfully",
                closeButton: true
            });
            loadCustomers();
        } catch (error: any) {
            console.log(error)
            if (error.response.status === 400) {
                toast("Failed", {
                    description: "User has data on other tables, can't be deleted.",
                    closeButton: true
                });
                return;
            }
            toast("Failed", {
                description: "Server error.",
                closeButton: true
            });
        }
    }
    async function update(id: number) {
        try {
            toast("Updating...", {
                description: "Please wait",
                closeButton: true
            });
            const res = await axios({
                method: 'PUT',
                url: '/api/admin/customers',
                headers: {
                    "Content-Type": "application/json"
                }, 
                data: JSON.stringify({id, name, username, email, gender, status})
            });
            toast("Success", {
                description: "Updated successfully",
                closeButton: true
            });
            loadCustomers();
        } catch (error: any) {
            console.log(error)
            if (error.response.status === 400) {
                toast("Failed", {
                    description: error.response.data.message,
                    closeButton: true
                });
                return;
            }
            toast("Failed", {
                description: "Server error.",
                closeButton: true
            });
        }
    }

    return(
        <>
        <div className="w-full p-5 py-5">
            {/* <h1 className="trext-3xl font-bold tracking-wider pb-6">Dashboard</h1> */}
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>Manage customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-1 flex gap-1">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline"><Trash2 className="w-4 text-red-300"/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Delete selected accounts?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the account from the servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => del(0, true)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div>
                        <Input onChange={(e) => setFilter(e.target.value)} value={filter} placeholder="Search..."/>
                    </div>
                  </div>
                  <div className="w-full border rounded-lg">
                     <Table>
                        <TableCaption>A list of customers.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-4">
                                    <Checkbox onCheckedChange={(c: boolean) => setCustomers(customers.map((i) => ({...i, checked: c})))}/>
                                </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Birthday</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((itm, idx) => {
                                return(
                                    <TableRow key={idx}>
                                        <TableCell className="absolute">
                                            <Checkbox onCheckedChange={(c: boolean) => setCustomers(customers.map((i) => (i.id === itm.id ? {...i, checked: c}:{...i})))} checked={itm.checked}/> 
                                        </TableCell>
                                        <TableCell>{itm.name || "Not set"}</TableCell>
                                        <TableCell>{itm.username}</TableCell>
                                        <TableCell>{itm.email}</TableCell>
                                        <TableCell>{itm.gender || "Not set"}</TableCell>
                                        <TableCell>{itm.birthdate || "Not set"}</TableCell>
                                        <TableCell>{itm.status}</TableCell>
                                        <TableCell className="w-[140px] py-0 space-x-2">
                                            {/* Delett */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button className="mt-1 h-8" variant="outline"><Trash2 className="w-4"/></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete `{itm.username}` account?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the account from the servers.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => del(itm.id, false)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            {/* Update */}
                                            <Dialog onOpenChange={() => {
                                                setUsername(itm.username);
                                                setName(itm.name || "");
                                                setGender(itm.gender || "");
                                                setEmail(itm.email);
                                                setStatus(itm.status.toString());
                                            }}>
                                                <DialogTrigger asChild>
                                                    <Button className="mt-1 h-8"><PenLine className="w-4"/></Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                    <DialogTitle>Edit customer `{itm.username}`</DialogTitle>
                                                    <DialogDescription>
                                                        Make changes with this account here. Click save when you're done.
                                                    </DialogDescription>
                                                    </DialogHeader>
                                                    <div>
                                                        <Label className="text-sm font-medium">Name</Label>
                                                        <Input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter name"/>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Username*</Label>
                                                        <Input onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Enter username"/>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Email*</Label>
                                                        <Input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter email"/>
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="gender">Gender</Label>
                                                        <Select onValueChange={(v) => setGender(v)} value={gender}>
                                                            <SelectTrigger id="gender">
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full">
                                                                <SelectItem value="Male">Male</SelectItem>
                                                                <SelectItem value="Female">Female</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="monnth">Birthdate</Label>
                                                        <div className="flex gap-2">
                                                        <Select disabled>
                                                            <SelectTrigger id="month">
                                                            <SelectValue placeholder="Month" />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper">
                                                            <SelectItem disabled value="0">Month</SelectItem>
                                                            <SelectItem value="1">January</SelectItem>
                                                            <SelectItem value="2">Febuary</SelectItem>
                                                            <SelectItem value="3">March</SelectItem>
                                                            <SelectItem value="4">April</SelectItem>
                                                            <SelectItem value="5">May</SelectItem>
                                                            <SelectItem value="6">June</SelectItem>
                                                            <SelectItem value="7">July</SelectItem>
                                                            <SelectItem value="8">August</SelectItem>
                                                            <SelectItem value="9">September</SelectItem>
                                                            <SelectItem value="10">October</SelectItem>
                                                            <SelectItem value="11">November</SelectItem>
                                                            <SelectItem value="12">December</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Input 
                                                        disabled
                                                            className="w-20"
                                                            id="day"
                                                            type="number"
                                                            placeholder="00"
                                                        />
                                                        <Input
                                                        disabled
                                                            className="w-20"
                                                            id="year"
                                                            type="number"
                                                            placeholder="1900"
                                                        />
                                                        </div>
                                                    </div>
                                                    <div className="w-full">
                                                        <Label htmlFor="gender">Status</Label>
                                                        <Select onValueChange={(v) => setStatus(v)} value={status}>
                                                            <SelectTrigger id="gender">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full">
                                                                <SelectItem value="0">Banned</SelectItem>
                                                                <SelectItem value="1">Active</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button onClick={() => update(itm.id)} type="submit">Save changes</Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                      </Table>
                  </div>
                </CardContent>
            </Card>
        </div>
        </>
    )
}

export default CustomerDashboard;