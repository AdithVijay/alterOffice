import React, { useEffect, useState } from 'react';
import { Link2, Menu } from 'lucide-react';
import { Button } from '../components/ui/button'  
import { Input } from '../components/ui/input';   
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import axiosInstance from '@/config/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '@/redux/UserSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([])
  const [shortUrl,setShortUrl] = useState('')
  const user =  useSelector((state)=>state.user.users)
  console.log("adsaasdasd",user)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    getUrlData()
  }, [])
  

  const getUrlData = async()=>{
    try {
      const response = await axiosInstance.get(`/api/getUrlData/${user}`)
      console.log(response)
      console.log("aa",response.data)
      setUrls(response.data)
    } catch (error) {
        console.log(error)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { url, user };
      if (shortUrl) {
        payload.customAlias = shortUrl; 
      }
      
      console.log("payloadd ",payload)
      
      const response = await axiosInstance.post("/api/shorten", payload);
      console.log(response)
      setUrl('');
      setShortUrl(''); 
      await getUrlData();
      toast.success("url created")
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }
  
 async function logout(){
  dispatch(logoutUser())
  navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="flex h-16 items-center px-4 container mx-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4">
                <Link2 className="h-6 w-6" />
               
                <Button  variant="ghost" className="justify-start">
                  Dashboard
                </Button>
            
                <Button variant="ghost" className="justify-start">
                  Settings
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 md:gap-4">
            <Link2 className="h-6 w-6" />
            <h1 className="text-xl font-bold">URL Shortener</h1>
          </div>
          <div className="hidden md:flex items-center ml-auto gap-4">
          <Link to={"/dashboard"}>
            <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button variant="ghost" onClick={logout} className="text-sm">
                Logout
              </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-6 px-4">
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
          <Input
            type="url"
            placeholder="Enter your URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit">Shorten URL</Button>
          <Input
            type="text"  
            placeholder="Enter custom alias (optional)"
            value={shortUrl || ""}  
            onChange={(e) => setShortUrl(e.target.value.trim())}  
            className="flex-1 max-w-[250px]"  
          />
          <Button type="submit">Custom Short URL</Button>
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead className=" text-left">More Info</TableHead>
                <TableHead className=" text-right">Clicks</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {urls.map((url) => (
            <TableRow key={url._id}>
              <TableCell className="font-medium truncate max-w-[200px]">
                <a href={url.longUrl} target="_blank" rel="noopener noreferrer">
                  {url.longUrl}
                </a>
              </TableCell>
              <TableCell>
                <a href={`http://ec2-13-202-114-120.ap-south-1.compute.amazonaws.com:3000/api/${url.shortUrl}`} target="_blank" rel="noopener noreferrer">
                  {`http://ec2-13-202-114-120.ap-south-1.compute.amazonaws.com:3000/api/${url.shortUrl}`}
                </a>
                {url.type === "custom" && <span className="text-xs text-gray-500"> (Custom)</span>}
              </TableCell>
              <TableCell>
                <Modal urlId={url._id} />
              </TableCell>
              <TableCell className="text-right">{url.clicks}</TableCell>
              <TableCell className="text-right">{new Date(url.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Profile;