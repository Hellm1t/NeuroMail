import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useGmail } from '@/hooks/useGmail';
import Layout from '@/components/Layout';
import MailList from '@/components/MailList';
import EmailView from '@/components/EmailView';
import Sidebar, { EmailCategory } from '@/components/Sidebar';

export default function Home() {
  const { data: session, status } = useSession();
  const { emails, loading: emailsLoading, error } = useGmail();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EmailCategory>('inbox');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Проверка размера экрана для адаптивности
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleSelectEmail = (emailId: string) => {
    setSelectedEmail(emailId);
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
  };

  const handleSelectCategory = (category: EmailCategory) => {
    setSelectedCategory(category);
    setSelectedEmail(null); // Сбрасываем выбранное письмо при смене категории
  };

  return (
    <>
      <Head>
        <title>NeuroMail - Умное управление почтой</title>
        <meta name="description" content="Интеллектуальное управление электронной почтой с интеграцией Gmail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="flex h-[calc(100vh-64px)]">
          {/* Левая панель (Sidebar) */}
          <Sidebar 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleSelectCategory}
            isMobile={isMobile}
          />
          
          {/* Центральная область (MailList или EmailView) */}
          <div className="flex-grow overflow-hidden">
            {selectedEmail ? (
              <EmailView 
                emailId={selectedEmail} 
                onBack={handleBackToList}
              />
            ) : (
              <MailList 
                emails={emails} 
                loading={emailsLoading} 
                error={error}
                selectedEmailId={selectedEmail}
                onSelectEmail={handleSelectEmail}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
} 