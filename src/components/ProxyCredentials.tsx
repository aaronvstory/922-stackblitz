import React, { useState } from 'react';
import { Key, Lock, CheckCircle, XCircle, Info } from 'lucide-react';
import { ProxyCredentials } from '../types/proxy';

interface ProxyCredentialsProps {
  credentials: ProxyCredentials | null;
  onCredentialsChange: (credentials: ProxyCredentials) => void;
  isConnected: boolean;
  onConnect: () => void;
}

export const ProxyCredentialsComponent: React.FC<ProxyCredentialsProps> = ({
  credentials,
  onCredentialsChange,
  isConnected,
  onConnect,
}) => {
  const [username, setUsername] = useState(credentials?.username || '');
  const [password, setPassword] = useState(credentials?.password || '');
  const [endpoint, setEndpoint] = useState(credentials?.endpoint || 'na.proxys5.net');
  const [port, setPort] = useState(credentials?.port || 6200);

  const handleSave = () => {
    const newCredentials: ProxyCredentials = {
      username,
      password,
      endpoint,
      port,
    };
    onCredentialsChange(newCredentials);
  };

  const handleConnect = () => {
    handleSave();
    onConnect();
  };

  const exampleUsernames = [
    'script-zone-custom-region-US-sessid-YMNLiMX9-sessTime-120',
    'script-zone-custom-region-AU-sessid-6JaIuS6S-sessTime-120',
    'script-zone-custom-region-UK-sessid-Kx9mP2nQ-sessTime-60',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Key size={20} />
        922Proxy Credentials
      </h2>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">922Proxy Authentication</p>
            <p className="mb-2">
              922Proxy uses username/password authentication directly with their proxy endpoints. 
              No API token required for proxy generation.
            </p>
            <p className="font-medium">Username Format:</p>
            <code className="text-xs bg-blue-100 px-2 py-1 rounded">
              script-zone-custom-region-[REGION]-sessid-[SESSION_ID]-sessTime-[DURATION]
            </code>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="script-zone-custom-region-US-sessid-YMNLiMX9-sessTime-120"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Examples:</p>
            <div className="space-y-1">
              {exampleUsernames.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setUsername(example)}
                  className="block text-xs text-blue-600 hover:text-blue-800 font-mono bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your 922proxy password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endpoint
          </label>
          <select
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="na.proxys5.net">na.proxys5.net (North America)</option>
            <option value="eu.proxys5.net">eu.proxys5.net (Europe)</option>
            <option value="ap.proxys5.net">ap.proxys5.net (Asia Pacific)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Port
          </label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            min="1"
            max="65535"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleConnect}
          disabled={!username || !password}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Lock size={16} />
          Save Credentials
        </button>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-600 font-medium">Credentials Saved</span>
            </>
          ) : (
            <>
              <XCircle size={16} className="text-red-600" />
              <span className="text-red-600 font-medium">Not Configured</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};