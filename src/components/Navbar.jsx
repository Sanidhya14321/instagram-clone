import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, Film, MessageCircle, Bell, PlusSquare, User, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebaseConfig';

export default function Sidebar({ user }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', icon: <Home className="w-6 h-6" /> },
    { to: '/search', label: 'Search', icon: <Search className="w-6 h-6" /> },
    { to: '/explore', label: 'Explore', icon: <Compass className="w-6 h-6" /> },
    { to: '/reels', label: 'Reels', icon: <Film className="w-6 h-6" /> },
    { to: '/messagingpage', label: 'Messages', icon: <MessageCircle className="w-6 h-6" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-6 h-6" /> },
    { to: '/createpage', label: 'Create', icon: <PlusSquare className="w-6 h-6" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-6 h-6" /> },
  ];

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out');
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-500 to-indigo-600 shadow-lg z-10 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} md:w-64`}>
      <div className="flex items-center justify-center py-4">
        <Link to="/" className="text-2xl text-white" style={{ fontFamily: 'Dancing Script', fontWeight: '900' }}>
          <h1 className={`font-extrabold ${isOpen ? '' : 'hidden md:block'}`}>Instagram</h1>
        </Link>
      </div>

      <motion.ul
        className="flex flex-col items-center space-y-4 md:items-start md:pl-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {links.map((link, index) => (
          <li key={index} className="w-full">
            <Link
              to={link.to}
              className={`flex items-center justify-center md:justify-start w-full space-x-2 p-3 text-white hover:bg-indigo-700 rounded-md ${location.pathname === link.to ? 'bg-indigo-700' : ''}`}
            >
              {link.icon}
              <span className={`hidden md:inline ${isOpen ? '' : 'md:hidden'}`}>{link.label}</span>
            </Link>
          </li>
        ))}

        {user && (
          <li className="w-full">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center md:justify-start w-full space-x-2 p-3 text-white hover:bg-indigo-700 rounded-md"
            >
              <LogOut className="w-6 h-6" />
              <span className={`hidden md:inline ${isOpen ? '' : 'md:hidden'}`}>Logout</span>
            </button>
          </li>
        )}
      </motion.ul>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 left-4 md:hidden bg-white p-2 rounded-full shadow-md"
      >
        <Menu className="w-6 h-6 text-indigo-600" />
      </button>
    </div>
  );
}
