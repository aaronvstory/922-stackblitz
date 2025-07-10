import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, ChevronDown, Building, Globe } from 'lucide-react';
import { Region, State, City, ASN, FavoriteLocation } from '../types/proxy';
import { proxyService } from '../services/proxyService';

interface LocationSelectorProps {
  regions: Region[];
  favorites: FavoriteLocation[];
  selectedRegion: string;
  selectedState: string;
  selectedCity: string;
  selectedASN: string;
  onRegionChange: (regionId: string) => void;
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  onASNChange: (asnId: string) => void;
  onAddFavorite: (location: FavoriteLocation) => void;
  onRemoveFavorite: (locationId: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  regions,
  favorites,
  selectedRegion,
  selectedState,
  selectedCity,
  selectedASN,
  onRegionChange,
  onStateChange,
  onCityChange,
  onASNChange,
  onAddFavorite,
  onRemoveFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get available states, cities, and ASNs based on selections
  const availableStates = useMemo(() => {
    if (!selectedRegion) return [];
    const loadStates = async () => {
      try {
        return await proxyService.getStatesForRegion(selectedRegion);
      } catch (error) {
        console.error('Failed to load states:', error);
        return [];
      }
    };
    
    loadStates().then(states => {
      // This would need to be handled with state management
      // For now, keeping the synchronous version
    });
    
    // Temporary fallback - in production this should be async
    return [];
  }, [selectedRegion]);

  const availableCities = useMemo(() => {
    if (!selectedRegion || !selectedState) return [];
    return proxyService.getCitiesForState(selectedRegion, selectedState);
  }, [selectedRegion, selectedState]);

  const availableASNs = useMemo(() => {
    if (!selectedRegion) return [];
    
    if (selectedState && selectedCity) {
      return proxyService.getASNsForCity(selectedRegion, selectedState, selectedCity);
    } else {
      return proxyService.getAllASNsForRegion(selectedRegion);
    }
  }, [selectedRegion, selectedState, selectedCity]);

  const filteredRegions = useMemo(() => {
    if (!searchTerm) return regions;
    return regions.filter(region =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [regions, searchTerm]);

  const favoriteRegions = useMemo(() => {
    return favorites.map(fav => regions.find(r => r.id === fav.country)).filter(Boolean) as Region[];
  }, [favorites, regions]);

  const isFavorite = (regionId: string, stateId?: string, cityId?: string, asnId?: string) => {
    return favorites.some(fav => 
      fav.country === regionId &&
      fav.state === stateId &&
      fav.city === cityId &&
      fav.asn === asnId
    );
  };

  const toggleFavorite = () => {
    if (!selectedRegion) return;
    
    const favoriteId = `${selectedRegion}-${selectedState || 'any'}-${selectedCity || 'any'}-${selectedASN || 'any'}`;
    
    if (isFavorite(selectedRegion, selectedState, selectedCity, selectedASN)) {
      onRemoveFavorite(favoriteId);
    } else {
      const regionInfo = regions.find(r => r.id === selectedRegion);
      const stateInfo = availableStates.find(s => s.id === selectedState);
      const cityInfo = availableCities.find(c => c.id === selectedCity);
      const asnInfo = availableASNs.find(a => a.id === selectedASN);
      
      const parts = [regionInfo?.name];
      if (stateInfo) parts.push(stateInfo.name);
      if (cityInfo) parts.push(cityInfo.name);
      if (asnInfo) parts.push(`AS${asnInfo.number}`);
      
      const favorite: FavoriteLocation = {
        id: favoriteId,
        name: parts.join(' → '),
        country: selectedRegion,
        state: selectedState,
        city: selectedCity,
        asn: selectedASN,
        createdAt: Date.now(),
      };
      onAddFavorite(favorite);
    }
  };

  const selectFavorite = (favorite: FavoriteLocation) => {
    onRegionChange(favorite.country);
    if (favorite.state) onStateChange(favorite.state);
    if (favorite.city) onCityChange(favorite.city);
    if (favorite.asn) onASNChange(favorite.asn);
  };

  const handleRegionChange = (regionId: string) => {
    onRegionChange(regionId);
    onStateChange('');
    onCityChange('');
    onASNChange('');
  };

  const handleStateChange = (stateId: string) => {
    onStateChange(stateId);
    onCityChange('');
    onASNChange('');
  };

  const handleCityChange = (cityId: string) => {
    onCityChange(cityId);
    onASNChange('');
  };

  const selectedRegionInfo = regions.find(r => r.id === selectedRegion);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin size={20} />
          Location Selection
        </h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Building size={16} />
          Advanced Targeting
          <ChevronDown size={16} className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search regions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            Favorite Locations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {favorites.map((favorite) => (
              <button
                key={favorite.id}
                onClick={() => selectFavorite(favorite)}
                className="text-left p-3 bg-white border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-sm">{favorite.name}</div>
                <div className="text-xs text-gray-500">
                  Added {new Date(favorite.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Region Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Region/Country
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {favoriteRegions.length > 0 && (
            <>
              {favoriteRegions.map((region) => (
                <button
                  key={`fav-${region.id}`}
                  onClick={() => handleRegionChange(region.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all ${
                    selectedRegion === region.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={14} />
                    <span className="font-medium text-sm">{region.name}</span>
                    <Star size={12} className="text-yellow-500 fill-current" />
                  </div>
                  <div className="text-xs text-gray-600">{region.endpoint}</div>
                </button>
              ))}
            </>
          )}
          
          {filteredRegions.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionChange(region.id)}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                selectedRegion === region.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Globe size={14} />
                <span className="font-medium text-sm">{region.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{region.code}</span>
              </div>
              <div className="text-xs text-gray-600">{region.endpoint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Location Selection */}
      {showAdvanced && selectedRegion && (
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* State Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any State</option>
                {availableStates.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!selectedState}
              >
                <option value="">Any City</option>
                {availableCities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ASN Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISP/ASN
              </label>
              <select
                value={selectedASN}
                onChange={(e) => onASNChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any ISP</option>
                {availableASNs.map((asn) => (
                  <option key={asn.id} value={asn.id}>
                    {asn.provider} (AS{asn.number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ASN Details */}
          {selectedASN && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
              {(() => {
                const asnInfo = availableASNs.find(a => a.id === selectedASN);
                return asnInfo ? (
                  <div className="text-sm">
                    <span className="font-medium text-blue-900">Selected ISP:</span>
                    <div className="text-blue-800">
                      {asnInfo.provider} - {asnInfo.name} (AS{asnInfo.number})
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Add to Favorites */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Star
                size={16}
                className={isFavorite(selectedRegion, selectedState, selectedCity, selectedASN) ? 'text-yellow-500 fill-current' : 'text-gray-400'}
              />
              {isFavorite(selectedRegion, selectedState, selectedCity, selectedASN) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      )}

      {/* Selected Location Summary */}
      {selectedRegionInfo && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Target Location</h3>
          <div className="text-sm text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Region:</span> {selectedRegionInfo.name}
              </div>
              {selectedState && (
                <div>
                  <span className="font-medium">State:</span> {availableStates.find(s => s.id === selectedState)?.name}
                </div>
              )}
              {selectedCity && (
                <div>
                  <span className="font-medium">City:</span> {availableCities.find(c => c.id === selectedCity)?.name}
                </div>
              )}
              {selectedASN && (
                <div>
                  <span className="font-medium">ISP:</span> {availableASNs.find(a => a.id === selectedASN)?.provider}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};