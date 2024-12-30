import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/config/axiosInstance";
import { IoMdArrowBack } from "react-icons/io"
import { Link } from "react-router-dom";

export default function Dashboard() {
  const user = useSelector((state) => state.user.users);
  const [urls, setUrls] = useState([])
console.log(user);

  useEffect(() => {
    getUrlData();
  }, []);

  const getUrlData = async () => {
    try {
      const response = await axiosInstance.get(`/api/analytics/overall/${user}`);
      console.log("API Response:", response.data); 
      setUrls(response.data.refinedData || []); 
    } catch (error) {
      console.error("Error fetching URL data:", error);
      setUrls([]); 
    }
  };


  const totalUrls = urls.length;
  const totalClicks = urls?.reduce((sum, url) => sum + url.clicks, 0);
  const uniqueUsers = urls?.reduce((sum, url) => sum + url.uniqueUsers, 0);


  const clicksByDate = urls
    .flatMap((url) => url.clicksByDate)
    .reduce((acc, { date, clickCount }) => {
      const existingDate = acc.find((item) => item.date === date);
      if (existingDate) {
        existingDate.clickCount += clickCount;
      } else {
        acc.push({ date, clickCount });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  const osType = urls
    .flatMap((url) => url.osType)
    .reduce((acc, { osName, uniqueClicks, uniqueUsers }) => {
      const existingOS = acc.find((item) => item.osName === osName);
      if (existingOS) {
        existingOS.uniqueClicks += uniqueClicks;
        existingOS.uniqueUsers += uniqueUsers;
      } else {
        acc.push({ osName, uniqueClicks, uniqueUsers });
      }
      return acc;
    }, []);


  const deviceType = urls
    .flatMap((url) => url.deviceType)
    .reduce((acc, { deviceName, uniqueClicks, uniqueUsers }) => {
      const existingDevice = acc.find((item) => item.deviceName === deviceName);
      if (existingDevice) {
        existingDevice.uniqueClicks += uniqueClicks;
        existingDevice.uniqueUsers += uniqueUsers;
      } else {
        acc.push({ deviceName, uniqueClicks, uniqueUsers });
      }
      return acc;
    }, []);

  return (
    <div>
        <Link to={"/profile"} className=" flex text-center align-middle items-center">
            <IoMdArrowBack className=" text-4xl ml-5 pt-2" />
            <div className=" pt-2">go back</div>
        </Link>
        <div className="space-y-4 p-5">
          <Card>
            <CardHeader>
              <CardTitle>URL Analytics Overview</CardTitle>
              <CardDescription>Summary of your short URL performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{totalUrls}</p>
                  <p className="text-sm text-muted-foreground">Total URLs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalClicks}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{uniqueUsers}</p>
                  <p className="text-sm text-muted-foreground">Unique Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="90%" height={300}>
              <BarChart data={clicksByDate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clickCount" fill="hsl(221, 70%, 46%)" /> 
                    </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {osType?.map((os, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{os.osName}</span>
                      <span>{os.uniqueClicks} clicks ({os.uniqueUsers} users)</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-5">
                  {deviceType?.map((device, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{device.deviceName}</span>
                      <span>{device.uniqueClicks} clicks ({device.uniqueUsers} users)</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
}
