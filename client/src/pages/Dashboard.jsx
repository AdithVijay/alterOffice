import React, { useState } from 'react';
import { Link2, Menu } from 'lucide-react';
import { Button } from '../components/ui/button'  // Ensure you have a Button component
import { Input } from '../components/ui/input';    // Ensure you have an Input component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';  // Ensure your Table component exists
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';  // Ensure your Sheet component exists

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([
    {
      id: '1',
      originalUrl: 'https://example.com/very/long/url/that/needs/shortening',
      shortUrl: 'https://short.url/abc123',
      clicks: 42,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      originalUrl: 'https://another-example.com/with/long/path',
      shortUrl: 'https://short.url/xyz789',
      clicks: 17,
      createdAt: '2024-01-02',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUrl = {
      id: (urls.length + 1).toString(),
      originalUrl: url,
      shortUrl: `https://short.url/${Math.random().toString(36).substring(7)}`,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUrls([...urls, newUrl]);
    setUrl('');
  };

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
                <Button variant="ghost" className="justify-start">
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
            <Button variant="ghost">Dashboard</Button>
            <Button variant="ghost">Settings</Button>
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
        </form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original URL</TableHead>
                <TableHead>Short URL</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((url) => (
                <TableRow key={url.id}>
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {url.originalUrl}
                  </TableCell>
                  <TableCell>
                    {url.shortUrl} 
                  </TableCell>
                  <TableCell className="text-right">{url.clicks}</TableCell>
                  <TableCell className="text-right">{url.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;