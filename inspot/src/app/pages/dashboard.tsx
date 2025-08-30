'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  MapPin,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  Calendar,
  Shield,
  Zap,
  TrendingUp,
  Activity,
  ChevronRight,
  LogOut,
} from 'lucide-react';

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
}

interface User {
  name?: string;
  email?: string;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User>({});

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
      title: 'Total Spaces',
      value: '245',
      change: '+12%',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8%',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Occupancy Rate',
      value: '87%',
      change: '+5%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Energy Usage',
      value: '2.4kW',
      change: '-3%',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Room Booking',
      description: 'Book meeting rooms and spaces',
      icon: <Calendar className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Space Analytics',
      description: 'View detailed usage reports',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Security Center',
      description: 'Monitor access and alerts',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'System Health',
      description: 'Check system performance',
      icon: <Activity className="w-8 h-8" />,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <MapPin className="w-5 h-5" />, label: 'Spaces' },
    { icon: <Users className="w-5 h-5" />, label: 'Users' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Bookings' },
    { icon: <Shield className="w-5 h-5" />, label: 'Security' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

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
              <p className="text-sm text-gray-500">Indoor Management</p>
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50 hover:text-gray-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4 ml-auto" />}
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
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-white text-sm font-bold">{getUserInitials(user.name, user.email)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">Welcome back, {getUserDisplayName()}!</h3>
            <p className="text-blue-100">
              Here what happening in your facility today. You have 3 new bookings and 2 alerts to review.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl text-white`}>
                    {stat.icon}
                  </div>
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h4 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h4>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card p-6 rounded-2xl text-left hover:shadow-lg transition-all group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h4>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Conference Room A booked', time: '2 minutes ago', user: 'Sarah Johnson' },
                  { action: 'Security alert resolved', time: '15 minutes ago', user: 'System' },
                  { action: 'New user registered', time: '1 hour ago', user: 'Mike Chen' },
                  { action: 'Maintenance completed', time: '2 hours ago', user: 'John Smith' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
              <div className="space-y-4">
                {[
                  { system: 'Access Control', status: 'Online', color: 'bg-green-500' },
                  { system: 'HVAC System', status: 'Online', color: 'bg-green-500' },
                  { system: 'Lighting Control', status: 'Online', color: 'bg-green-500' },
                  { system: 'Security Cameras', status: 'Maintenance', color: 'bg-yellow-500' },
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${system.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-800">{system.system}</span>
                    </div>
                    <span className="text-xs text-gray-500">{system.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}