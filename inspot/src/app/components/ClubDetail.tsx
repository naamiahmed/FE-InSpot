'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, DollarSign, MapPin, Calendar, Users, Star } from 'lucide-react';
import { clubAPI, slotAPI, bookingAPI } from '../utils/api';

interface Club {
  id: number;
  name: string;
  location: string;
  manager_id: number;
  status: string;
}

interface Slot {
  id: number;
  club_id: number;
  time: string;
  price: number;
  available: boolean;
}

interface ClubDetailProps {
  clubId: number;
  onBack?: () => void;
}

export default function ClubDetail({ clubId, onBack }: ClubDetailProps) {
  const [club, setClub] = useState<Club | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fetchClubDetails = useCallback(async () => {
    try {
      setLoading(true);
      // Since we don't have a specific club endpoint, we'll fetch all clubs and find the one we need
      const response = await clubAPI.getClubs();
      const foundClub = response.data.find((c: Club) => c.id === clubId);
      if (foundClub) {
        setClub(foundClub);
      } else {
        setError('Club not found.');
      }
    } catch {
      setError('Failed to fetch club details.');
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  const fetchSlots = useCallback(async () => {
    try {
      setSlotsLoading(true);
      const response = await slotAPI.getSlotsByClub(clubId);
      setSlots(response.data);
    } catch {
      setError('Failed to fetch slots.');
    } finally {
      setSlotsLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    const fetchData = async () => {
      if (clubId) {
        await fetchClubDetails();
        await fetchSlots();
      }
    };
    fetchData();
  }, [clubId, fetchClubDetails, fetchSlots]);

  const handleBookSlot = async (slotId: number) => {
    try {
      setBookingLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        setError('Please log in to book a slot.');
        return;
      }

      await bookingAPI.createBooking({
        user_id: user.id,
        slot_id: slotId,
      });

      setSuccessMessage('Slot booked successfully!');
      setError('');
      
      // Refresh slots
      fetchSlots();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && err.message ? err.message : 'Failed to book slot. Please try again.';
      setError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return timeString;
    }
  };

  const formatTimeOnly = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  // Group slots by date
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = formatDate(slot.time);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

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

  if (!club) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Club not found.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Clubs
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Clubs
        </motion.button>
      )}

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Club Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{club.name}</h1>
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-2" />
              <span className="text-xl">{club.location}</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Available Slots: {slots.length}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span>Premium Club</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${
            club.status === 'approved' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {club.status}
          </div>
        </div>
      </motion.div>

      {/* Available Slots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Calendar className="w-8 h-8 mr-3 text-blue-600" />
          Available Time Slots
        </h2>

        {slotsLoading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Clock className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Available Slots
            </h3>
            <p className="text-gray-500">
              This club currently has no available time slots.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSlots).map(([date, dateSlots], index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  {date}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dateSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-semibold text-gray-800">
                            {formatTimeOnly(slot.time)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-purple-600 mr-1" />
                          <span className="font-bold text-purple-600">
                            ${slot.price}
                          </span>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBookSlot(slot.id)}
                        disabled={bookingLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bookingLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                          />
                        ) : (
                          'Book Now'
                        )}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
