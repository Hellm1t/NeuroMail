import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>NeuroMail</title>
        <meta name="description" content="Умное управление электронной почтой" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session && <Navbar />}
      
      <main className="flex-grow overflow-hidden">
        {children}
      </main>
      
      <footer className="py-2 text-center text-xs text-gray-500 border-t border-gray-200">
        <p>© {new Date().getFullYear()} NeuroMail. Все права защищены.</p>
      </footer>
    </div>
  );
} 