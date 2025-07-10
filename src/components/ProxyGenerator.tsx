import React, { useState } from 'react';
import { Play, Settings, RotateCcw, Download } from 'lucide-react';

interface ProxyGeneratorProps {
  selectedRegion: string;
  selectedState: string;
  selectedCity: string;
  selectedASN: string;
  onGenerate: (params: {
    region: string;
    state?: string;
    city?: string;
    asn?: string;
    protocol: 'HTTP' | 'SOCKS5';
    quantity: number;
    sessionTime: number;
  }) => void;
  onExport: (format: 'csv' | 'txt' | 'json') => void;
  onClearAll: () => void;
  loading: boolean;
  proxyCount: number;
}

export const ProxyGenerator: React.FC<ProxyGeneratorProps> = ({
  selectedRegion,
  selectedState,
  selectedCity,
  selectedASN,
  onGenerate,
  onExport,
  onClearAll,
  loading,
  proxyCount,
}) => {
  const [protocol, setProtocol] = useState<'HTTP' | 'SOCKS5'>('HTTP');
  const [quantity, setQuantity] = useState(1);
  const [sessionTime, setSessionTime] = useState(120);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    if (!selectedRegion) return;
    
    onGenerate({
      region: selectedRegion,
      state: selectedState || undefined,
      city: selectedCity || undefined,
      asn: selectedASN || undefined,
      protocol,
      quantity,
      sessionTime,
    });
  };

  const isGenerateDisabled = !selectedRegion || loading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Proxy Generation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Protocol
          </label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value as 'HTTP' | 'SOCKS5')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HTTP">HTTP</option>
            <option value="SOCKS5">SOCKS5</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(50, Number(e.target.value))))}
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Time (min)
          </label>
          <select
            value={sessionTime}
            onChange={(e) => setSessionTime(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
            <option value={240}>4 hours</option>
            <option value={480}>8 hours</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Play size={16} />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Settings size={16} />
          Advanced Options
        </button>
        
        {proxyCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {proxyCount} proxies generated
            </span>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={16} />
              Clear All
            </button>
          </div>
        )}
      </div>
      
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium mb-3">Export Options</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onExport('csv')}
              disabled={proxyCount === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => onExport('txt')}
              disabled={proxyCount === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              TXT
            </button>
            <button
              onClick={() => onExport('json')}
              disabled={proxyCount === 0}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              JSON
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-2">Session Information</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• <strong>Session ID:</strong> Each proxy gets a unique session for IP stickiness</p>
              <p>• <strong>Session Time:</strong> How long the IP remains consistent</p>
              <p>• <strong>Location Targeting:</strong> More specific = fewer available IPs</p>
              <p>• <strong>ASN Targeting:</strong> Target specific ISPs for better authenticity</p>
              <p>• <strong>IP Rotation:</strong> Use "Rotate IP" button to get fresh sessions</p>
            </div>
          </div>
        </div>
      )}
      
      {!selectedRegion && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please select a region to generate proxies
          </p>
        </div>
      )}
    </div>
  );
};