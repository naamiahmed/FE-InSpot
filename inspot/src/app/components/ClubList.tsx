'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Calendar, Users, Building, CheckCircle, ChevronRight } from 'lucide-react';
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

interface ClubListProps {
  onBookingSuccess?: () => void;
}

export default function ClubList({ onBookingSuccess }: ClubListProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubAPI.getClubs();
      setClubs(response.data);
      setError('');
    } catch {
      setError('Failed to fetch clubs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (clubId: number) => {
    try {
      setSlotsLoading(true);
      const response = await slotAPI.getSlotsByClub(clubId);
      setSlots(response.data);
      setError('');
    } catch {
      setError('Failed to fetch slots. Please try again.');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setSlots([]);
    fetchSlots(club.id);
  };

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
      
      // Refresh slots to show updated availability
      if (selectedClub) {
        fetchSlots(selectedClub.id);
      }
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }

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
            Discover <span className="text-blue-600">Amazing Clubs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of premium clubs and book your preferred time slots with ease
          </p>
        </motion.div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-l-4 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-8 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Clubs List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Available Clubs
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {clubs.length} clubs
              </span>
            </div>
            
            <div className="space-y-4">
              {clubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleClubSelect(club)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    selectedClub?.id === club.id
                      ? 'transform scale-105'
                      : 'hover:transform hover:scale-102'
                  }`}
                >
                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedClub?.id === club.id
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                            selectedClub?.id === club.id
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                              : 'bg-gray-100 group-hover:bg-blue-100'
                          }`}>
                            <Building className={`w-6 h-6 ${
                              selectedClub?.id === club.id ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {club.name}
                            </h3>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{club.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            club.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              club.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
                          </div>
                          
                          {selectedClub?.id === club.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center text-blue-600"
                            >
                              <CheckCircle className="w-5 h-5 mr-1" />
                              <span className="text-sm font-medium">Selected</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className={`w-6 h-6 transition-transform ${
                        selectedClub?.id === club.id 
                          ? 'text-blue-600 transform rotate-90' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </div>
                  </div>
                </motion.div>
              ))}

              {clubs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
                >
                  <Building className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Clubs Available</h3>
                  <p className="text-gray-500">Check back later for new club listings</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Slots List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                Available Slots
              </h2>
              {selectedClub && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Selected Club</p>
                  <p className="font-semibold text-gray-900">{selectedClub.name}</p>
                </div>
              )}
            </div>

            {!selectedClub ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300"
              >
                <Calendar className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-2">Select a Club First</h3>
                <p className="text-gray-500 text-lg">Choose a club from the left to view available time slots</p>
                <div className="mt-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block w-3 h-3 bg-blue-500 rounded-full mx-1"
                  ></motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="inline-block w-3 h-3 bg-purple-500 rounded-full mx-1"
                  ></motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    className="inline-block w-3 h-3 bg-green-500 rounded-full mx-1"
                  ></motion.div>
                </div>
              </motion.div>
            ) : slotsLoading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"
                />
                <span className="ml-4 text-lg font-medium text-gray-600">Loading slots...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-green-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl flex items-center justify-center mr-4">
                            <Clock className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gray-900">
                              {formatTime(slot.time)}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">Available Slot</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-2xl font-bold text-purple-600">${slot.price}</span>
                            <span className="text-sm text-gray-500 ml-1">/session</span>
                          </div>
                          
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">Available Now</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBookSlot(slot.id)}
                          disabled={bookingLoading}
                          className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-xl"
                        >
                          {bookingLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <span className="flex items-center">
                              <Calendar className="w-5 h-5 mr-2" />
                              Book Now
                            </span>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {slots.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300"
                  >
                    <Clock className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No Available Slots
                    </h3>
                    <p className="text-gray-500">This club currently has no available time slots</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
