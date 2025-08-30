'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Thermometer, 
  Activity, 
  Shield,
  Settings,
  ArrowLeft,
  Plus,
  Filter
} from 'lucide-react';

interface ClubPageProps {
  clubId?: string;
}

export default function ClubPage({ clubId = "club-001" }: ClubPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [clubData, setClubData] = useState({
    name: "Conference Room Alpha",
    type: "Meeting Room",
    capacity: 12,
    currentOccupancy: 8,
    status: "occupied",
    temperature: 22,
    humidity: 45,
    airQuality: "Good",
    lastUpdated: new Date(),
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const upcomingBookings = [
    {
      title: "Team Standup",
      time: "10:00 - 10:30",
      organizer: "Sarah Johnson",
      attendees: 6,
      status: "confirmed"
    },
    {
      title: "Client Presentation",
      time: "14:00 - 15:30",
      organizer: "Mike Chen",
      attendees: 8,
      status: "pending"
    },
    {
      title: "Department Review",
      time: "16:00 - 17:00",
      organizer: "Emma Wilson",
      attendees: 10,
      status: "confirmed"
    },
  ];

  const recentActivity = [
    { action: "Meeting started", time: "2 minutes ago", user: "Sarah Johnson" },
    { action: "Room temperature adjusted", time: "15 minutes ago", user: "System" },
    { action: "Security scan completed", time: "1 hour ago", user: "Security" },
    { action: "Cleaning completed", time: "3 hours ago", user: "Maintenance" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{clubData.name}</h1>
                <p className="text-sm text-gray-500">
                  {clubData.type} • Capacity {clubData.capacity} • ID: {clubId}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                clubData.status === 'occupied' 
                  ? 'bg-red-100 text-red-700' 
                  : clubData.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {clubData.status.charAt(0).toUpperCase() + clubData.status.slice(1)}
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-500">Current</span>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Occupancy</h4>
            <p className="text-3xl font-bold text-gray-800">
              {clubData.currentOccupancy}/{clubData.capacity}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                <Thermometer className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-500">°C</span>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Temperature</h4>
            <p className="text-3xl font-bold text-gray-800">{clubData.temperature}°</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-500">%</span>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Humidity</h4>
            <p className="text-3xl font-bold text-gray-800">{clubData.humidity}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm text-green-600">●</span>
            </div>
            <h4 className="text-gray-600 text-sm font-medium mb-1">Air Quality</h4>
            <p className="text-3xl font-bold text-gray-800">{clubData.airQuality}</p>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Room Layout */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Layout</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600">Interactive room layout will be displayed here</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {clubData.currentOccupancy} of {clubData.capacity} seats occupied
                      </p>
                    </div>
                  </div>
                </div>

                {/* Environmental Controls */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Controls</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Temperature</span>
                        <span className="text-lg font-bold text-blue-600">{clubData.temperature}°C</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(clubData.temperature / 30) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Humidity</span>
                        <span className="text-lg font-bold text-green-600">{clubData.humidity}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${clubData.humidity}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Air Quality</span>
                        <span className="text-lg font-bold text-purple-600">{clubData.airQuality}</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Today Bookings</h3>
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {upcomingBookings.map((booking, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{booking.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{booking.attendees} attendees</span>
                        </div>
                        <span>by {booking.organizer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Book This Room
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Generate Report
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Send Alert
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}