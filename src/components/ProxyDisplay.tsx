import React, { useState } from 'react';
import { Copy, CheckCircle, Eye, EyeOff, ExternalLink, RefreshCw, RotateCcw, TestTube, ChevronDown, ChevronUp } from 'lucide-react';
import { ProxyConfig } from '../types/proxy';
import { ProxyTesting } from './ProxyTesting';

interface ProxyDisplayProps {
  proxies: ProxyConfig[];
  onCopyField: (field: string, value: string) => void;
  onCopyComplete: (proxy: ProxyConfig, format: string) => void;
  onTestProxy: (proxy: ProxyConfig) => void;
  onVerifyProxy: (proxy: ProxyConfig) => void;
  onRotateSession: (proxy: ProxyConfig) => void;
  testResults: { [key: string]: any };
  loading: boolean;
}

export const ProxyDisplay: React.FC<ProxyDisplayProps> = ({
  proxies,
  onCopyField,
  onCopyComplete,
  onTestProxy,
  onVerifyProxy,
  onRotateSession,
  testResults,
  loading,
}) => {
  const [showCredentials, setShowCredentials] = useState(false);
  const [copiedFields, setCopiedFields] = useState<{ [key: string]: boolean }>({});
  const [expandedProxy, setExpandedProxy] = useState<string | null>(null);

  const handleCopy = async (field: string, value: string, proxyId: string) => {
    try {
      await navigator.clipboard.writeText(value);
      onCopyField(field, value);
      setCopiedFields({ ...copiedFields, [`${proxyId}-${field}`]: true });
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [`${proxyId}-${field}`]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatProxy = (proxy: ProxyConfig, format: 'standard' | 'http' | 'socks5') => {
    const base = `${proxy.domain}:${proxy.port}:${proxy.username}:${proxy.password}`;
    switch (format) {
      case 'http':
        return `http://${proxy.username}:${proxy.password}@${proxy.domain}:${proxy.port}`;
      case 'socks5':
        return `socks5://${proxy.username}:${proxy.password}@${proxy.domain}:${proxy.port}`;
      default:
        return base;
    }
  };

  const handleCopyComplete = async (proxy: ProxyConfig, format: string) => {
    const formatted = formatProxy(proxy, format as any);
    try {
      await navigator.clipboard.writeText(formatted);
      onCopyComplete(proxy, format);
      const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
      setCopiedFields({ ...copiedFields, [`${proxyId}-${format}`]: true });
      setTimeout(() => {
        setCopiedFields(prev => ({ ...prev, [`${proxyId}-${format}`]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getTestStatus = (proxy: ProxyConfig) => {
    const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
    return testResults[proxyId];
  };

  const toggleExpanded = (proxyId: string) => {
    setExpandedProxy(expandedProxy === proxyId ? null : proxyId);
  };

  const maskCredentials = (text: string) => {
    return showCredentials ? text : '•'.repeat(Math.min(text.length, 12));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Generating proxies...</span>
        </div>
      </div>
    );
  }

  if (proxies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">No proxies generated yet</div>
          <div className="text-sm text-gray-500">Select a region and generate proxies to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generated Proxies ({proxies.length})</h2>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showCredentials ? <EyeOff size={16} /> : <Eye size={16} />}
            {showCredentials ? 'Hide' : 'Show'} Credentials
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {proxies.map((proxy, index) => {
          const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
          const testStatus = getTestStatus(proxy);
          
          return (
            <div key={proxyId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      proxy.protocol === 'HTTP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {proxy.protocol}
                    </span>
                    <span className="text-sm text-gray-500">
                      {proxy.country}
                      {proxy.state && ` → ${proxy.state}`}
                      {proxy.city && ` → ${proxy.city}`}
                      {proxy.asn && ` → AS${proxy.asn}`}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Session: {proxy.sessionTime}min
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{proxy.domain}</span>
                        <button
                          onClick={() => handleCopy('domain', proxy.domain, proxyId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedFields[`${proxyId}-domain`] ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Port</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{proxy.port}</span>
                        <button
                          onClick={() => handleCopy('port', proxy.port.toString(), proxyId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedFields[`${proxyId}-port`] ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm truncate max-w-32" title={proxy.username}>
                          {showCredentials ? proxy.username : `${proxy.username.substring(0, 20)}...`}
                        </span>
                        <button
                          onClick={() => handleCopy('username', proxy.username, proxyId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedFields[`${proxyId}-username`] ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{maskCredentials(proxy.password)}</span>
                        <button
                          onClick={() => handleCopy('password', proxy.password, proxyId)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {copiedFields[`${proxyId}-password`] ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="text-xs text-gray-500 mb-4">
                    <span className="font-medium">Session ID:</span> {proxy.sessionId} | 
                    <span className="font-medium"> Duration:</span> {proxy.sessionTime} minutes
                  </div>
                </div>
                
                {testStatus && (
                  <div className="ml-4">
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      testStatus.status === 'success' ? 'bg-green-100 text-green-700' :
                      testStatus.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {testStatus.status === 'success' ? 'Online' :
                       testStatus.status === 'failed' ? 'Failed' : 'Testing...'}
                    </div>
                    {testStatus.responseTime && (
                      <div className="text-xs text-gray-500 mt-1">
                        {testStatus.responseTime}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCopyComplete(proxy, 'standard')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {copiedFields[`${proxyId}-standard`] ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  Standard
                </button>
                
                <button
                  onClick={() => handleCopyComplete(proxy, 'http')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  {copiedFields[`${proxyId}-http`] ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  HTTP
                </button>
                
                <button
                  onClick={() => handleCopyComplete(proxy, 'socks5')}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  {copiedFields[`${proxyId}-socks5`] ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  SOCKS5
                </button>
                
                <button
                  onClick={() => onTestProxy(proxy)}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={14} />
                  Test
                </button>
                
                <button
                  onClick={() => onRotateSession(proxy)}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-orange-300 text-orange-700 rounded hover:bg-orange-50 transition-colors"
                >
                  <RotateCcw size={14} />
                  Rotate IP
                </button>
                
                <button
                  onClick={() => onVerifyProxy(proxy)}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink size={14} />
                  Verify
                </button>
                
                <button
                  onClick={() => toggleExpanded(proxyId)}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                >
                  <TestTube size={14} />
                  Advanced Test
                  {expandedProxy === proxyId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
              
              {/* Advanced Testing Panel */}
              {expandedProxy === proxyId && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <ProxyTesting 
                    proxy={proxy}
                    onTestComplete={(result) => {
                      // Update test results if needed
                      console.log('Test completed:', result);
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};