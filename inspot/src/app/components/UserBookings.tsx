'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, DollarSign, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingAPI } from '../utils/api';

interface Booking {
  id: number;
  time: string;
  price: number;
  club_name: string;
  status: string;
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        setError('Please log in to view your bookings.');
        return;
      }

      const response = await bookingAPI.getUserBookings(user.id);
      setBookings(response.data);
      setError('');
    } catch {
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            My <span className="text-purple-600">Bookings</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage all your club bookings in one place
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="max-w-4xl mx-auto">
          {bookings.length > 0 && (
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-purple-600" />
                Your Reservations
              </h2>
              <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {bookings.length} booking{bookings.length > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-8">
                    {/* Club Name */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.club_name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">Club Location</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl flex items-center justify-center mr-4">
                        <Clock className="w-7 h-7 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatTime(booking.time)}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">Booking Time</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4">
                        <DollarSign className="w-7 h-7 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          ${booking.price}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">Total Cost</p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-6 lg:mt-0 lg:ml-8">
                    <div className={`inline-flex items-center px-4 py-3 rounded-xl border-2 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-3 text-sm font-bold capitalize">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-mono text-xs">#</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Booking ID: <span className="font-mono font-bold text-gray-700">#{booking.id}</span>
                    </p>
                  </div>
                  
                  {booking.status.toLowerCase() === 'confirmed' && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs font-medium">Confirmed</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {bookings.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <Calendar className="w-32 h-32 text-gray-300 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-gray-600 mb-4">
                No Bookings Yet
              </h3>
              <p className="text-lg text-gray-500 mb-8">
                You haven&apos;t made any bookings. Start exploring clubs and book your first slot!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/clubs'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
              >
                Browse Clubs
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Summary Card */}
        {bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Booking Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {bookings.length}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {bookings.filter(b => b.status.toLowerCase() === 'confirmed').length}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Confirmed</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">
                    {bookings.filter(b => b.status.toLowerCase() === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">Pending</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
