import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Boxes, Package, TrendingUp, Users } from "lucide-react";
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  function AdminDashboard() {
  
    return(
      <>
        <div className="w-full">
          <h1 className="text-3xl font-bold p-4 px-5">Dashboard</h1>
          <div className="w-full h-auto grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-5">
            <div className="w-[100%] max-w-[500px]">
              <Card className="w-full pt-5">
                <CardContent>
                  <div className="font-semibold text-accent-foreground/80 flex">
                    <span className="flex-grow">Total Sales</span>
                    <span><TrendingUp className="w-4"/></span>
                  </div>
                  <h1 className="font-bold text-3xl">₱10,000</h1>
                </CardContent>
              </Card>
            </div>
            <div className="w-[100%] max-w-[500px]">
              <Card className="w-full pt-5">
                <CardContent>
                  <div className="font-semibold text-accent-foreground/80 flex">
                    <span className="flex-grow">Total Customers</span>
                    <span><Users className="w-4"/></span>
                  </div>
                  <h1 className="font-bold text-3xl">400</h1>
                </CardContent>
              </Card>
            </div>
            <div className="w-[100%] max-w-[500px]">
              <Card className="w-full pt-5">
                <CardContent>
                  <div className="font-semibold text-accent-foreground/80 flex">
                    <span className="flex-grow">Product</span>
                    <span><Package className="w-4"/></span>
                  </div>
                  <h1 className="font-bold text-3xl">200</h1>
                </CardContent>
              </Card>
            </div>
            <div className="w-[100%] max-w-[500px]">
              <Card className="w-full pt-5">
                <CardContent>
                  <div className="font-semibold text-accent-foreground/80 flex">
                    <span className="flex-grow">Total orders</span>
                    <span><Boxes className="w-4"/></span>
                  </div>
                  <h1 className="font-bold text-3xl">100</h1>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full p-5 flex gap-4">
            <div className="w-full">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-lg">Recent Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableCaption>A list of recent students.</TableCaption>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Firstname</TableHead>
                            <TableHead>Middlename</TableHead>
                            <TableHead>Lastname</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>DAD</TableCell>
                            <TableCell>adad</TableCell>
                            <TableCell>wdq</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableCaption>A list of recent students.</TableCaption>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Firstname</TableHead>
                            <TableHead>Middlename</TableHead>
                            <TableHead>Lastname</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                            <TableCell>DAD</TableCell>
                            <TableCell>adad</TableCell>
                            <TableCell>wdq</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export default AdminDashboard;