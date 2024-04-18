"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Boxes, Package, PenLine, Plus, Trash2, TrendingUp, Users } from "lucide-react";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce"; 
import axios from "axios";
import { toast } from "sonner"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryType = {
    id: number
    category: string
    description: string
    checked: boolean
}

function Category() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [debounce] = useDebounce(search, 300);

    useEffect(() => {
        loadCategories();
    }, [debounce]);

    async function loadCategories() {
        try {
            const res = await axios({
                url: '/api/admin/categories',
                method: 'GET',
                params: {
                    search
                }
            });
            const newData = res.data.map((i: CategoryType) => ({...i, checked: false}));
            setCategories(newData);
        } catch (error: any) {
            toast("Failed to load customers", {
                description: "Server error.",
                closeButton: true
            });
        }
    }

    async function create(e:  React.MouseEvent<HTMLButtonElement>) {
        const target = e.target as HTMLButtonElement;
        target.disabled = true;
        target.innerText = "Submitting...."
        try {
            const res = await axios({
                url: '/api/admin/categories',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    category, description
                })
            });
            toast("Success", {
                description: "New category added",
                closeButton: true
            });
            loadCategories();
            setCategory("");
            setDescription("");
        } catch (error: any) {
            toast("Failed to create", {
                description: "Server error.",
                closeButton: true
            });
        }
        target.disabled = false;
        target.innerText = "Submit"
    }
    async function update(e:  React.MouseEvent<HTMLButtonElement>, id: number) {
        const target = e.target as HTMLButtonElement;
        target.disabled = true;
        target.innerText = "Saving..."
        try {
            const res = await axios({
                url: '/api/admin/categories',
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    id, category: newCategory, description: newDescription
                })
            });
            toast("Success", {
                description: "Modified successfully",
                closeButton: true
            });
            loadCategories();
            setNewCategory("");
            setNewDescription("");
        } catch (error: any) {
            toast("Failed to modify", {
                description: "Server error.",
                closeButton: true
            });
        }
        target.disabled = false;
        target.innerText = "Save changes"
    }

    
    async function del(id: number, many: boolean) {
        try {
            if (many) {
                const id = categories.filter(i => (i.checked)).map(i => (i.id));
                const res = await axios({
                    method: 'DELETE',
                    url: '/api/admin/categories',
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    data: JSON.stringify({id, many})
                });
            } else {
                const res = await axios({
                    method: 'DELETE',
                    url: '/api/admin/categories',
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
            loadCategories();
        } catch (error: any) {
            toast("Failed", {
                description: "Server error.",
                closeButton: true
            });
        }
    }
  
    return(
      <>
        <div className="w-full">
          <h1 className="text-3xl font-bold p-4 px-5">Dashboard</h1>
          <div className="w-full p-5 flex gap-4">
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Categories</CardTitle>
                        <CardDescription>Manage categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="mb-1 flex gap-1">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline"><Trash2 className="w-4 text-red-300"/></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Delete selected categories?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the data from the servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => del(0, true)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <div>
                            <Input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..."/>
                        </div>
                        <span className="grow"></span>
                        <div>
                            <Popover onOpenChange={() => {setCategory("");setDescription("")}}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline"><Plus className="w-4"/> Create</Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Create new category</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="">
                                            <Label htmlFor="Category">Category</Label>
                                            <Input
                                                id="Category"
                                                placeholder="Enter category"
                                                onChange={(e) => setCategory(e.target.value)}
                                                value={category}
                                            />
                                            </div>
                                            <div className="">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea 
                                                placeholder="Enter category description"
                                                onChange={(e) => setDescription(e.target.value)}
                                                value={description}
                                            ></Textarea>
                                            </div>
                                        </div>
                                        <div className="">
                                            <Button onClick={create} disabled={category.trim() === "" || description.trim() === ""} className="w-full">Submit</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="border rounded-lg">
                        <Table>
                            <TableCaption>A list of categories.</TableCaption>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-7">
                                    <Checkbox onCheckedChange={(c: boolean) => setCategories(categories.map((i) => ({...i, checked: c})))}/>
                                </TableHead>
                                <TableHead className="w-72">Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[140px]">Actons</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((itm, idx) => {
                                    return(
                                        <TableRow key={idx}>
                                            <TableCell className="absolute">
                                                <Checkbox onCheckedChange={(c: boolean) => setCategories(categories.map((i) => (i.id === itm.id ? {...i, checked: c}:{...i})))} checked={itm.checked}/>
                                            </TableCell>
                                            <TableCell>{itm.category}</TableCell>
                                            <TableCell>{itm.description}</TableCell>
                                            <TableCell className="py-0 space-x-2">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button className="mt-1 h-8" variant="outline"><Trash2 className="w-4"/></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete `{itm.category}`?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the data from the servers.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => del(itm.id, false)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <Popover onOpenChange={() => {setNewCategory(itm.category);setNewDescription(itm.description)}}>
                                                    <PopoverTrigger asChild>
                                                        <Button className="mt-1 h-8"><PenLine className="w-4"/></Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent align="end" className="w-80">
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium leading-none">Modify `{itm.category}` category</h4>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="">
                                                                <Label htmlFor="Category">Category</Label>
                                                                <Input
                                                                    id="Category"
                                                                    placeholder="Enter category"
                                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                                    value={newCategory}
                                                                />
                                                                </div>
                                                                <div className="">
                                                                <Label htmlFor="description">Description</Label>
                                                                <Textarea 
                                                                    placeholder="Enter category description"
                                                                    onChange={(e) => setNewDescription(e.target.value)}
                                                                    value={newDescription}
                                                                ></Textarea>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <Button onClick={(e) => update(e, itm.id)} className="w-full">Save changes</Button>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default Category;