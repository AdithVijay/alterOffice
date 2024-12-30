"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axiosInstance from "@/config/axiosInstance"

// Dummy data matching the MongoDB schema structure
const analyticsData = {
  longUrl: "https://example.com/very-long-url-that-needs-shortening",
  shortUrl: "http://short.url/abc123",
  clicks: 1250,
  uniqueUsers: 875,
  clicksByDate: [
    { date: "2024-01-01", clickCount: 150 },
    { date: "2024-01-02", clickCount: 220 },
    { date: "2024-01-03", clickCount: 180 },
    { date: "2024-01-04", clickCount: 290 },
    { date: "2024-01-05", clickCount: 310 },
    { date: "2024-01-06", clickCount: 240 },
    { date: "2024-01-07", clickCount: 280 },
  ],
  osType: [
    { osName: "Windows", uniqueClicks: 450, uniqueUsers: 320 },
    { osName: "MacOS", uniqueClicks: 380, uniqueUsers: 275 },
    { osName: "Linux", uniqueClicks: 220, uniqueUsers: 180 },
    { osName: "iOS", uniqueClicks: 150, uniqueUsers: 120 },
    { osName: "Android", uniqueClicks: 180, uniqueUsers: 145 },
  ],
  deviceType: [
    { deviceName: "Desktop", uniqueClicks: 680, uniqueUsers: 520 },
    { deviceName: "Mobile", uniqueClicks: 420, uniqueUsers: 340 },
    { deviceName: "Tablet", uniqueClicks: 150, uniqueUsers: 115 },
  ],
}

export default function Analytics({isOpen, onClose ,urlId}) {
  const [activeTab, setActiveTab] = useState("overview")
  const [data, setdata] = useState({
  osType: [],
  deviceType: [],
  clicksByDate: [],
});

  
console.log("url id",urlId)

  
useEffect(() => {
    getUrlAnalytics()
  }, [urlId])


    async function getUrlAnalytics(){
        try {
            const response = await axiosInstance.get(`api/analytics/${urlId}`)
            console.log("this is the response ",response)
            setdata(response.data)
            console.log(data)
            
        } catch (error) {
            console.log(error)
        }
    }
console.log("analytics data",data)


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="mt-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <DialogHeader>
            <DialogTitle>URL Analytics</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="os">Operating Systems</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 pb-3">
                      <div className="text-2xl font-bold">{data?.clicks}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 pb-3">
                      <div className="text-2xl font-bold">{data?.uniqueUsers}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                <CardHeader>
                    <CardTitle>Clicks Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                    config={{
                        clicks: {
                        label: "Clicks",
                        color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="h-[200px]"
                    >
                    <BarChart data={data?.clicksByDate}>
                        <Bar dataKey="clickCount" fill="var(--color-clicks)" name="Clicks" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="os" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Operating System Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        clicks: {
                          label: "Unique Clicks",
                          color: "hsl(var(--chart-1))",
                        },
                        users: {
                          label: "Unique Users",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[180px]"
                    >
                      <BarChart data={data?.osType}>
                        <Bar dataKey="uniqueClicks" fill="var(--color-clicks)" name="Clicks" />
                        <Bar dataKey="uniqueUsers" fill="var(--color-users)" name="Users" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Operating System Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operating System</TableHead>
                          <TableHead className="text-right">Unique Clicks</TableHead>
                          <TableHead className="text-right">Unique Users</TableHead>
                          <TableHead className="text-right">Click Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      {data?.osType?.map((os) => (
                        <TableRow key={os.osName}>
                          <TableCell className="font-medium">{os.osName}</TableCell>
                          <TableCell className="text-right">{os.uniqueClicks}</TableCell>
                          <TableCell className="text-right">{os.uniqueUsers}</TableCell>
                          <TableCell className="text-right">
                            {((os.uniqueClicks / data.clicks) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="devices" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        clicks: {
                          label: "Unique Clicks",
                          color: "hsl(var(--chart-1))",
                        },
                        users: {
                          label: "Unique Users",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[180px]"
                    >
                      <BarChart data={data?.deviceType}>
                        <Bar dataKey="uniqueClicks" fill="var(--color-clicks)" name="Clicks" />
                        <Bar dataKey="uniqueUsers" fill="var(--color-users)" name="Users" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Type Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device Type</TableHead>
                          <TableHead className="text-right">Unique Clicks</TableHead>
                          <TableHead className="text-right">Unique Users</TableHead>
                          <TableHead className="text-right">Click Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.deviceType.map((device) => (
                          <TableRow key={device.deviceName}>
                            <TableCell className="font-medium">{device.deviceName}</TableCell>
                            <TableCell className="text-right">{device.uniqueClicks}</TableCell>
                            <TableCell className="text-right">{device.uniqueUsers}</TableCell>
                            <TableCell className="text-right">
                              {((device.uniqueClicks / analyticsData.clicks) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
