import { useState } from 'react';
import { 
  FiInbox, 
  FiSend, 
  FiStar, 
  FiTrash2, 
  FiArchive, 
  FiTag, 
  FiAlertCircle, 
  FiMenu,
  FiX
} from 'react-icons/fi';

export type EmailCategory = 'inbox' | 'sent' | 'starred' | 'trash' | 'archive' | 'spam' | 'important';

interface SidebarProps {
  selectedCategory: EmailCategory;
  onSelectCategory: (category: EmailCategory) => void;
  isMobile?: boolean;
}

export default function Sidebar({ 
  selectedCategory, 
  onSelectCategory,
  isMobile = false
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const categories = [
    { id: 'inbox', name: 'Входящие', icon: FiInbox, count: 12 },
    { id: 'starred', name: 'Помеченные', icon: FiStar, count: 5 },
    { id: 'sent', name: 'Отправленные', icon: FiSend, count: 0 },
    { id: 'important', name: 'Важные', icon: FiAlertCircle, count: 3 },
    { id: 'archive', name: 'Архив', icon: FiArchive, count: 0 },
    { id: 'spam', name: 'Спам', icon: FiTag, count: 8 },
    { id: 'trash', name: 'Корзина', icon: FiTrash2, count: 0 },
  ];

  return (
    <>
      {/* Мобильная кнопка для открытия сайдбара */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg md:hidden"
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      {/* Сайдбар */}
      <div 
        className={`bg-white border-r border-gray-200 h-full overflow-y-auto transition-all duration-300 ${
          isOpen ? 'w-64' : isMobile ? 'w-0' : 'w-16'
        }`}
      >
        <div className="p-4">
          <h2 className={`font-bold text-lg ${!isOpen && !isMobile ? 'hidden' : ''}`}>
            Категории
          </h2>
        </div>

        <nav className="mt-2">
          <ul>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      onSelectCategory(category.id as EmailCategory);
                      if (isMobile) setIsOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left ${
                      selectedCategory === category.id
                        ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`${isOpen || isMobile ? 'mr-3' : 'mx-auto'}`} size={20} />
                    {(isOpen || isMobile) && (
                      <>
                        <span className="flex-grow">{category.name}</span>
                        {category.count > 0 && (
                          <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {category.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
} 