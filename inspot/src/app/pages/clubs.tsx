'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ClubList from '../components/ClubList';
import ClubDetail from '../components/ClubDetail';
import UserBookings from '../components/UserBookings';

type ViewMode = 'list' | 'detail' | 'bookings';

export default function ClubsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);

  const handleClubSelect = (clubId: number) => {
    setSelectedClubId(clubId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedClubId(null);
  };

  const handleViewBookings = () => {
    setViewMode('bookings');
  };

  const handleBookingSuccess = () => {
    // Optionally refresh data or show notification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {viewMode !== 'list' && (
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                {viewMode === 'list' && 'Browse Clubs'}
                {viewMode === 'detail' && 'Club Details'}
                {viewMode === 'bookings' && 'My Bookings'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Browse Clubs
              </button>
              <button
                onClick={handleViewBookings}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'bookings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                My Bookings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' && (
            <ClubList onBookingSuccess={handleBookingSuccess} />
          )}
          
          {viewMode === 'detail' && selectedClubId && (
            <ClubDetail
              clubId={selectedClubId}
              onBack={handleBackToList}
            />
          )}
          
          {viewMode === 'bookings' && (
            <UserBookings />
          )}
        </motion.div>
      </main>
    </div>
  );
}
