import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { FiMail, FiSettings, FiLogOut, FiMenu, FiX, FiSearch, FiHelpCircle } from 'react-icons/fi';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl text-primary-600">
                NeuroMail
              </Link>
            </div>
          </div>

          {/* Поиск (на мобильных устройствах скрыт по умолчанию) */}
          <div className={`${isSearchOpen ? 'flex' : 'hidden md:flex'} flex-grow max-w-2xl mx-4 items-center`}>
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Поиск писем..."
              />
            </div>
          </div>

          {/* Правая часть навбара */}
          <div className="flex items-center">
            {/* Кнопка поиска на мобильных */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <FiSearch className="h-5 w-5" />
            </button>

            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <FiHelpCircle className="h-5 w-5" />
            </button>

            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
              <FiSettings className="h-5 w-5" />
            </button>
            
            {/* Аватар пользователя */}
            <div className="ml-3 relative">
              {session?.user?.image && (
                <div>
                  <button 
                    onClick={toggleMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || 'Пользователь'} 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                  </button>
                  
                  {isMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiSettings className="inline mr-2" /> Настройки
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="inline mr-2" /> Выйти
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 