import React, { useState, useEffect } from 'react';
import { Shield, Wifi, Globe, AlertCircle } from 'lucide-react';
import { ProxyCredentialsComponent } from './components/ProxyCredentials';
import { LocationSelector } from './components/LocationSelector';
import { ProxyGenerator } from './components/ProxyGenerator';
import { ProxyDisplay } from './components/ProxyDisplay';
import { proxyService } from './services/proxyService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportProxies } from './utils/export';
import { 
  ProxyCredentials, 
  ProxyConfig, 
  FavoriteLocation, 
  ProxyHistory,
  ProxyTest 
} from './types/proxy';

function App() {
  // State for proxy credentials and connection
  const [credentials, setCredentials] = useLocalStorage<ProxyCredentials | null>('proxy-credentials', null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // State for regions and selection
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedASN, setSelectedASN] = useState('');

  // State for proxies
  const [proxies, setProxies] = useState<ProxyConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: ProxyTest }>({});

  // Local storage for favorites and history
  const [favorites, setFavorites] = useLocalStorage<FavoriteLocation[]>('proxy-favorites', []);
  const [history, setHistory] = useLocalStorage<ProxyHistory[]>('proxy-history', []);

  // Initialize proxy service if credentials are available
  useEffect(() => {
    // Load regions
    const loadRegions = async () => {
      try {
        const availableRegions = await proxyService.getAvailableRegions();
        setRegions(availableRegions);
      } catch (error) {
        console.error('Failed to load regions:', error);
      }
    };
    
    loadRegions();
    
    if (credentials) {
      proxyService.setCredentials(credentials);
      setIsConnected(true);
      setConnectionError(null);
    } else {
      setIsConnected(false);
    }
  }, [credentials]);

  const handleConnect = () => {
    if (credentials) {
      proxyService.setCredentials(credentials);
      setIsConnected(true);
      setConnectionError(null);
    }
  };

  const handleGenerate = async (params: { 
    region: string; 
    state?: string;
    city?: string;
    asn?: string;
    protocol: 'HTTP' | 'SOCKS5'; 
    quantity: number; 
    sessionTime: number;
  }) => {
    if (!credentials) {
      setConnectionError('Please configure proxy credentials first');
      return;
    }

    setLoading(true);
    setConnectionError(null);
    
    try {
      const newProxies = proxyService.generateProxy({
        region: params.region,
        state: params.state,
        city: params.city,
        asn: params.asn,
        protocol: params.protocol,
        quantity: params.quantity,
        sessionTime: params.sessionTime,
      });
      
      setProxies(prev => [...prev, ...newProxies]);
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to generate proxies');
    } finally {
      setLoading(false);
    }
  };

  const handleTestProxy = async (proxy: ProxyConfig) => {
    const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
    setTestResults(prev => ({
      ...prev,
      [proxyId]: { 
        id: proxyId, 
        proxy, 
        status: 'pending', 
        timestamp: Date.now() 
      }
    }));

    try {
      const result = await proxyService.testProxy(proxy);
      setTestResults(prev => ({
        ...prev,
        [proxyId]: {
          id: proxyId,
          proxy,
          status: result.success ? 'success' : 'failed',
          responseTime: result.responseTime,
          error: result.error,
          timestamp: Date.now()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [proxyId]: {
          id: proxyId,
          proxy,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        }
      }));
    }
  };

  const handleRotateSession = (proxy: ProxyConfig) => {
    const rotatedProxy = proxyService.rotateSession(proxy);
    setProxies(prev => prev.map(p => 
      p.sessionId === proxy.sessionId ? rotatedProxy : p
    ));
  };

  const handleVerifyProxy = (proxy: ProxyConfig) => {
    const proxyString = `${proxy.domain}:${proxy.port}`;
    const iperUrl = `https://iper.one/check?proxy=${encodeURIComponent(proxyString)}`;
    window.open(iperUrl, '_blank');
  };

  const handleCopyField = (field: string, value: string) => {
    // Optional: Show toast notification
    console.log(`Copied ${field}: ${value}`);
  };

  const handleCopyComplete = (proxy: ProxyConfig, format: string) => {
    // Add to history
    const historyItem: ProxyHistory = {
      id: `${proxy.domain}:${proxy.port}:${proxy.sessionId}-${Date.now()}`,
      proxy,
      usedAt: Date.now(),
      successful: true,
    };
    setHistory(prev => [historyItem, ...prev.slice(0, 99)]); // Keep last 100 items
  };

  const handleExport = (format: 'csv' | 'txt' | 'json') => {
    exportProxies(proxies, format);
  };

  const handleClearAll = () => {
    setProxies([]);
    setTestResults({});
  };

  const handleAddFavorite = (location: FavoriteLocation) => {
    setFavorites(prev => [...prev, location]);
  };

  const handleRemoveFavorite = (locationId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== locationId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">922Proxy Interface</h1>
                <p className="text-sm text-gray-600">Professional residential proxy management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{proxies.length} proxies</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi size={16} className={isConnected ? 'text-green-600' : 'text-gray-400'} />
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-600'}`}>
                  {isConnected ? 'Connected' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Connection Error */}
        {connectionError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={16} />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{connectionError}</p>
          </div>
        )}

        {/* Proxy Credentials */}
        <ProxyCredentialsComponent
          credentials={credentials}
          onCredentialsChange={setCredentials}
          isConnected={isConnected}
          onConnect={handleConnect}
        />

        {/* Region Selection */}
        {isConnected && (
          <LocationSelector
            regions={regions}
            favorites={favorites}
            selectedRegion={selectedRegion}
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedASN={selectedASN}
            onRegionChange={setSelectedRegion}
            onStateChange={setSelectedState}
            onCityChange={setSelectedCity}
            onASNChange={setSelectedASN}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
          />
        )}

        {/* Proxy Generation */}
        {isConnected && (
          <ProxyGenerator
            selectedRegion={selectedRegion}
            selectedState={selectedState}
            selectedCity={selectedCity}
            selectedASN={selectedASN}
            onGenerate={handleGenerate}
            onExport={handleExport}
            onClearAll={handleClearAll}
            loading={loading}
            proxyCount={proxies.length}
          />
        )}

        {/* Proxy Display */}
        {isConnected && (
          <ProxyDisplay
            proxies={proxies}
            onCopyField={handleCopyField}
            onCopyComplete={handleCopyComplete}
            onTestProxy={handleTestProxy}
            onVerifyProxy={handleVerifyProxy}
            onRotateSession={handleRotateSession}
            testResults={testResults}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;