import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await fetch('https://koches-api.onrender.com/items');
    const data = await res.json();

    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <pre>{JSON.stringify(items, null, 2)}</pre>
      </div>
    </main>
  );
}
