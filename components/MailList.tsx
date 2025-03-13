import { useState } from 'react';
import { FiRefreshCw, FiSearch, FiStar, FiTrash2, FiArchive } from 'react-icons/fi';
import { Email } from '@/hooks/useGmail';
import { EmailCategory } from './Sidebar';

interface MailListProps {
  emails: Email[];
  loading: boolean;
  error: string | null;
  selectedEmailId: string | null;
  onSelectEmail: (emailId: string) => void;
  selectedCategory: EmailCategory;
}

export default function MailList({
  emails,
  loading,
  error,
  selectedEmailId,
  onSelectEmail,
  selectedCategory
}: MailListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    
    // Если сегодня, показываем время
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Если в этом году, показываем месяц и день
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Иначе показываем дату с годом
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredEmails = searchQuery
    ? emails.filter(
        (email) =>
          email.headers?.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.headers?.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.snippet.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails;

  // Фильтрация по категории
  const categoryFilteredEmails = filteredEmails.filter(email => {
    if (selectedCategory === 'inbox') {
      return email.labelIds.includes('INBOX');
    } else if (selectedCategory === 'starred') {
      return email.labelIds.includes('STARRED');
    } else if (selectedCategory === 'sent') {
      return email.labelIds.includes('SENT');
    } else if (selectedCategory === 'important') {
      return email.labelIds.includes('IMPORTANT');
    } else if (selectedCategory === 'trash') {
      return email.labelIds.includes('TRASH');
    } else if (selectedCategory === 'spam') {
      return email.labelIds.includes('SPAM');
    } else if (selectedCategory === 'archive') {
      return email.labelIds.includes('ARCHIVE');
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Поиск писем"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-200" title="Обновить">
            <FiRefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Архивировать">
            <FiArchive className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-1 rounded hover:bg-gray-200" title="Удалить">
            <FiTrash2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="text-sm text-gray-500">
          {categoryFilteredEmails.length} {getCategoryName(selectedCategory)}
        </div>
      </div>
      
      {error && (
        <div className="p-4 text-red-500 bg-red-50 border-b border-red-100">
          {error}
        </div>
      )}
      
      {loading && categoryFilteredEmails.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : categoryFilteredEmails.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          {searchQuery ? 'Нет писем, соответствующих поиску' : `В папке "${getCategoryName(selectedCategory)}" нет писем`}
        </div>
      ) : (
        <div className="flex-grow overflow-auto">
          {categoryFilteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                selectedEmailId === email.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onSelectEmail(email.id)}
            >
              <div className="flex items-start">
                <div className="mr-3 flex-shrink-0">
                  <button className="text-gray-400 hover:text-yellow-400 focus:outline-none">
                    <FiStar className={`h-5 w-5 ${email.labelIds.includes('STARRED') ? 'text-yellow-400 fill-current' : ''}`} />
                  </button>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-medium text-gray-900 truncate pr-2">
                      {email.headers?.from?.split('<')[0].trim() || 'Неизвестный отправитель'}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(email.headers?.date)}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                    {email.headers?.subject || '(Без темы)'}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {email.snippet}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryName(category: EmailCategory): string {
  switch (category) {
    case 'inbox': return 'Входящие';
    case 'sent': return 'Отправленные';
    case 'starred': return 'Помеченные';
    case 'trash': return 'Корзина';
    case 'archive': return 'Архив';
    case 'spam': return 'Спам';
    case 'important': return 'Важные';
    default: return 'Письма';
  }
} 