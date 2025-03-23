'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { MdLocationOn, MdDelete, MdSearch } from 'react-icons/md';
import { FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

interface FavoriteCity {
  id: string;
  cityName: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: FavoriteCity[];
  onSelectCity: (cityName: string) => void;
  onRemoveFavorite: (cityName: string) => void;
  onAddFavorite: (cityName: string) => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  favorites,
  onSelectCity,
  onRemoveFavorite,
  onAddFavorite,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    
    try {
      // Verify the city exists by making a weather API call
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`
      );
      
      // If we get here, the city exists
      onAddFavorite(response.data.name); // Use the official city name from the API
      setSearchQuery(''); // Clear the search input
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setSearchError('Byen ble ikke funnet. Vennligst sjekk for skrivefeil.');
      } else {
        setSearchError('Feil ved søk etter by. Vennligst prøv igjen.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[998]"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: isOpen ? '0%' : '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-blue-500/95 to-blue-300/95 backdrop-blur-sm text-white z-[999] shadow-xl"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Favorittbyer</h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="Søk etter by..."
                    className="flex-1 p-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MdSearch size={24} />
                  </button>
                </div>
                {searchError && (
                  <p className="text-red-200 text-sm mt-2">{searchError}</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {favorites.length > 0 ? (
                  <div className="space-y-2">
                    {favorites.map((city) => (
                      <div
                        key={city.id}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <button
                          onClick={() => {
                            onSelectCity(city.cityName);
                            onClose();
                          }}
                          className="flex items-center gap-2 flex-1"
                        >
                          <MdLocationOn size={20} />
                          <span>{city.cityName}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite(city.cityName);
                          }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors"
                          aria-label="Fjern fra favoritter"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-center text-white/70 mt-12">
                    <FaExclamationCircle size={48} />
                    <p>Ingen favorittbyer ennå</p>
                    <p className="text-sm">Søk etter en by for å legge den til i favoritter</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 