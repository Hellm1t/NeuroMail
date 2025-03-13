import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AuthButton from '@/components/AuthButton';

export default function Auth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  return (
    <>
      <Head>
        <title>NeuroMail - Вход</title>
        <meta name="description" content="Войдите в NeuroMail с помощью аккаунта Google" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">NeuroMail</h1>
            <p className="mt-2 text-gray-600">Умное управление электронной почтой</p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <AuthButton />
            </div>
            
            <div className="text-sm text-center text-gray-500">
              <p>Входя в систему, вы разрешаете NeuroMail доступ к вашему аккаунту Gmail</p>
              <p className="mt-2">Мы запрашиваем только те разрешения, которые необходимы для работы сервиса</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 