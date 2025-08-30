'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  Calendar,
  Zap,
  TrendingUp,
  ChevronRight,
  LogOut,
  Building,
  Clock,
} from 'lucide-react';
import ClubList from '../components/ClubList';
import UserBookings from '../components/UserBookings';

interface DashboardProps {
  onLogout?: () => void;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

interface User {
  name?: string;
  email?: string;
}

type ActiveView = 'dashboard' | 'clubs' | 'bookings' | 'analytics' | 'users' | 'settings';

export default function IntegratedDashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User>({});
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (onLogout) {
      onLogout();
    }
  };

  const getUserInitials = (name?: string, email?: string): string => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (): string => {
    if (user.name) {
      return user.name.split(' ')[0]; // First name only
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const stats: StatCard[] = [
    {
      title: 'Available Clubs',
      value: '12',
      change: '+3%',
      icon: <Building className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Bookings',
      value: '34',
      change: '+8%',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Your Bookings',
      value: '5',
      change: '+2',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Club Rating',
      value: '4.8',
      change: '+0.2',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Browse Clubs',
      description: 'Explore available clubs and book slots',
      icon: <Building className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      onClick: () => setActiveView('clubs'),
    },
    {
      title: 'My Bookings',
      description: 'View and manage your bookings',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      onClick: () => setActiveView('bookings'),
    },
    {
      title: 'Analytics',
      description: 'View detailed usage reports',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      onClick: () => setActiveView('analytics'),
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
      onClick: () => setActiveView('settings'),
    },
  ];

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', view: 'dashboard' as ActiveView },
    { icon: <Building className="w-5 h-5" />, label: 'Clubs', view: 'clubs' as ActiveView },
    { icon: <Calendar className="w-5 h-5" />, label: 'My Bookings', view: 'bookings' as ActiveView },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', view: 'analytics' as ActiveView },
    { icon: <Users className="w-5 h-5" />, label: 'Users', view: 'users' as ActiveView },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', view: 'settings' as ActiveView },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'clubs':
        return <ClubList onBookingSuccess={() => setActiveView('bookings')} />;
      case 'bookings':
        return <UserBookings />;
      case 'analytics':
        return (
          <div className="text-center py-16">
            <BarChart3 className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-500">Detailed analytics and reports will be available here.</p>
          </div>
        );
      case 'users':
        return (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">User Management Coming Soon</h3>
            <p className="text-gray-500">User management features will be available here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-16">
            <Settings className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Settings Coming Soon</h3>
            <p className="text-gray-500">Account and application settings will be available here.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32">
              <div className="w-full h-full rounded-full border-2 border-white"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 transform -translate-x-24 translate-y-24">
              <div className="w-full h-full rounded-full border-2 border-white"></div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="flex-1 text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Welcome back, {getUserDisplayName()}!
              </h2>
              <p className="text-blue-100 text-xl mb-4">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex items-center justify-center lg:justify-start text-blue-100">
                <Clock className="w-5 h-5 mr-2" />
                <span>Ready to explore amazing clubs?</span>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="bg-white/20 backdrop-blur rounded-2xl p-6">
                <p className="text-blue-100 text-sm mb-2">Current Time</p>
                <p className="text-4xl font-mono font-bold">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group"
          >
            <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <span className="text-green-600 text-sm font-bold bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                    <span className="text-gray-500 text-xs ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8 flex items-center"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          Quick Actions
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={action.onClick}
              className="group cursor-pointer"
            >
              <div className="glass-card p-8 rounded-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} text-white w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{action.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                
                <div className="mt-6 flex items-center text-blue-600 font-medium">
                  <span className="text-sm">Get Started</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 w-80 glass-card border-r border-white/20 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">IS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">InSpot</h1>
              <p className="text-sm text-gray-500">Club Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveView(item.view)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.view
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {activeView === item.view && <ChevronRight className="w-4 h-4 ml-auto" />}
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                  {activeView === 'dashboard' ? 'Dashboard' : activeView}
                </h1>
                <p className="text-sm text-gray-500 hidden lg:block">
                  {activeView === 'dashboard' && 'Welcome to your control center'}
                  {activeView === 'clubs' && 'Discover and book amazing clubs'}
                  {activeView === 'bookings' && 'Manage your reservations'}
                  {activeView === 'analytics' && 'Insights and reports'}
                  {activeView === 'users' && 'User management'}
                  {activeView === 'settings' && 'Account preferences'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button className="hidden lg:block p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="w-6 h-6 text-gray-600" />
              </button>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg">
                {getUserInitials(user.name, user.email)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
