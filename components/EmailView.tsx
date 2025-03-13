import { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrash2, FiArchive, FiCornerUpRight, FiCornerUpLeft, FiPaperclip, FiStar } from 'react-icons/fi';
import { useGmail } from '@/hooks/useGmail';

interface EmailViewProps {
  emailId: string;
  onBack: () => void;
}

export default function EmailView({ emailId, onBack }: EmailViewProps) {
  const { fetchEmailContent } = useGmail();
  const [email, setEmail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const emailData = await fetchEmailContent(emailId);
        setEmail(emailData);
      } catch (err) {
        console.error('Ошибка загрузки письма:', err);
        setError('Не удалось загрузить содержимое письма');
      } finally {
        setLoading(false);
      }
    };

    if (emailId) {
      loadEmail();
    }
  }, [emailId, fetchEmailContent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>{error}</p>
        <button 
          className="mt-4 btn btn-secondary"
          onClick={() => window.location.reload()}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Письмо не найдено
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEmailBody = () => {
    if (!email.body) return <p className="text-gray-500">Нет содержимого</p>;
    
    return (
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: email.body }}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex space-x-2">
          <button 
            className="p-1 rounded hover:bg-gray-200" 
            title="Назад"
            onClick={onBack}
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Архивировать">
            <FiArchive className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Удалить">
            <FiTrash2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Пометить">
            <FiStar className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-200" title="Ответить">
            <FiCornerUpLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Переслать">
            <FiCornerUpRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-medium mb-4">{email.headers?.subject || '(Без темы)'}</h1>
        
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
            {email.headers?.from?.charAt(0).toUpperCase() || '?'}
          </div>
          
          <div className="ml-3 flex-grow">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {email.headers?.from?.split('<')[0].trim() || 'Неизвестный отправитель'}
                </p>
                <p className="text-sm text-gray-500">
                  {email.headers?.from?.match(/<(.+)>/)?.[1] || ''}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(email.headers?.date)}
              </div>
            </div>
            
            <div className="mt-1 text-sm">
              <span className="text-gray-500">Кому: </span>
              <span>{email.headers?.to || 'мне'}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-grow overflow-auto">
        {renderEmailBody()}
      </div>
      
      {email.attachments && email.attachments.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="font-medium mb-2 flex items-center">
            <FiPaperclip className="mr-2" />
            Вложения ({email.attachments.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {email.attachments.map((attachment: any, index: number) => (
              <div key={index} className="border rounded p-2 flex items-center">
                <div className="bg-gray-100 p-2 rounded mr-2">
                  <FiPaperclip className="h-5 w-5 text-gray-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-sm font-medium">{attachment.filename}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(attachment.size / 1024)} КБ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 