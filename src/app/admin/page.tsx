"use client"

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
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import axios from "axios";
import formatPrice from "@/utils/formatPrice";

  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  type Chart = {
    name: string
    sales: number
  }
  
  type Stats = {
      sales: number
      products_count: number
      customers_count: number
      orders_count: number
  }
  type Order = {
      number: string
      quantity: number
      total: number
  }

  function AdminDashboard() {
    const [stats, setStats] = useState<Stats>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [chart, setChart] = useState<any>();
    console.log(chart)
    useEffect(() => {
      loadStatistics();
    }, []);

    async function loadStatistics() {
      try {
        const res = await axios.get("/api/admin/statistics");
        console.log(res.data)
        setStats(res.data.stats);
        setOrders(res.data.orders);
        setChart(res.data.chart);
      } catch (error) {
        
      }
    }

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
                  <h1 className="font-bold text-3xl">{formatPrice(stats?.sales || 0)}</h1>
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
                  <h1 className="font-bold text-3xl">{stats?.customers_count}</h1>
                </CardContent>
              </Card>
            </div>
            <div className="w-[100%] max-w-[500px]">
              <Card className="w-full pt-5">
                <CardContent>
                  <div className="font-semibold text-accent-foreground/80 flex">
                    <span className="flex-grow">Total Products</span>
                    <span><Package className="w-4"/></span>
                  </div>
                  <h1 className="font-bold text-3xl">{stats?.products_count}</h1>
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
                  <h1 className="font-bold text-3xl">{stats?.orders_count}</h1>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full p-5 flex gap-4 flex-col md:flex-row">
            <div className="w-full md:w-[60%] h-[50vh] md:h-[70vh] rounded-lg">
              <Card className="w-full h-full">
                  <CardHeader>
                  <CardTitle className="text-lg">Weekly Sales</CardTitle>
                  </CardHeader>
                  <CardContent className=" px-2 pb-14 w-full h-full">
                      <ResponsiveContainer className="p-0" width="100%" height="100%">
                        <LineChart
                          data={chart}
                          margin={{
                            right: 20,
                            bottom: 30,
                          }}
                        >
                          <CartesianGrid stroke="#88888899" strokeDasharray="3 3" />
                              <XAxis
                                dataKey="order_on"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                stroke="#888888"
                                className="stroke-primary"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                              />
                              <Tooltip labelClassName="text-primary"/>
                          <Line type="monotone" dataKey="total" stroke="primaryColor"  className="stroke-primary" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            <div className="w-full md:w-[40%]">
                <Card>
                    <CardHeader>
                    <CardTitle className="text-lg">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Table>
                        <TableCaption>A list of recent orders.</TableCaption>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Total items</TableHead>
                            <TableHead>Order Total</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders?.map((it, id) => (
                            <TableRow key={id}>
                              <TableCell>{it.number}</TableCell>
                              <TableCell>{it.quantity}</TableCell>
                              <TableCell>{formatPrice(it.total)}</TableCell>
                            </TableRow>
                          ))}
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