import React, { useState } from 'react';
import { 
  Play, 
  Zap, 
  Activity, 
  MapPin, 
  Clock, 
  Download, 
  Upload, 
  Wifi, 
  Copy, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Route
} from 'lucide-react';
import { ProxyConfig, ProxyTest, PerformanceTest, TraceHop } from '../types/proxy';
import { testingService } from '../services/testingService';

interface ProxyTestingProps {
  proxy: ProxyConfig;
  onTestComplete?: (result: ProxyTest) => void;
}

export const ProxyTesting: React.FC<ProxyTestingProps> = ({
  proxy,
  onTestComplete,
}) => {
  const [basicTest, setBasicTest] = useState<ProxyTest | null>(null);
  const [performanceTest, setPerformanceTest] = useState<PerformanceTest | null>(null);
  const [traceRoute, setTraceRoute] = useState<TraceHop[] | null>(null);
  const [loading, setLoading] = useState<{
    basic: boolean;
    performance: boolean;
    trace: boolean;
  }>({ basic: false, performance: false, trace: false });
  const [copiedIP, setCopiedIP] = useState(false);

  const handleBasicTest = async () => {
    setLoading(prev => ({ ...prev, basic: true }));
    try {
      const result = await testingService.testProxy(proxy);
      setBasicTest(result);
      onTestComplete?.(result);
    } catch (error) {
      console.error('Basic test failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, basic: false }));
    }
  };

  const handlePerformanceTest = async () => {
    setLoading(prev => ({ ...prev, performance: true }));
    try {
      const result = await testingService.performanceTest(proxy);
      setPerformanceTest(result);
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, performance: false }));
    }
  };

  const handleTraceRoute = async () => {
    setLoading(prev => ({ ...prev, trace: true }));
    try {
      const result = await testingService.traceRoute(proxy);
      setTraceRoute(result);
    } catch (error) {
      console.error('Trace route failed:', error);
    } finally {
      setLoading(prev => ({ ...prev, trace: false }));
    }
  };

  const copyIP = async () => {
    if (basicTest?.ip) {
      try {
        await navigator.clipboard.writeText(basicTest.ip);
        setCopiedIP(true);
        setTimeout(() => setCopiedIP(false), 2000);
      } catch (error) {
        console.error('Failed to copy IP:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatLatency = (latency: number) => {
    if (latency < 0) return 'Failed';
    if (latency < 50) return `${latency.toFixed(0)}ms (Excellent)`;
    if (latency < 100) return `${latency.toFixed(0)}ms (Good)`;
    if (latency < 200) return `${latency.toFixed(0)}ms (Fair)`;
    return `${latency.toFixed(0)}ms (Poor)`;
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleBasicTest}
          disabled={loading.basic}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading.basic ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play size={16} />
          )}
          Basic Test
        </button>

        <button
          onClick={handlePerformanceTest}
          disabled={loading.performance}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
        >
          {loading.performance ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Zap size={16} />
          )}
          Performance Test
        </button>

        <button
          onClick={handleTraceRoute}
          disabled={loading.trace}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 transition-colors"
        >
          {loading.trace ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Route size={16} />
          )}
          Trace Route
        </button>
      </div>

      {/* Basic Test Results */}
      {basicTest && (
        <div className={`p-4 border rounded-lg ${getStatusColor(basicTest.status)}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              {basicTest.status === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              Basic Connectivity Test
            </h3>
            <span className="text-sm">
              {basicTest.responseTime}ms response time
            </span>
          </div>

          {basicTest.status === 'success' && basicTest.ip && (
            <div className="space-y-3">
              {/* IP Address */}
              <div className="flex items-center gap-2">
                <Wifi size={16} />
                <span className="font-medium">IP Address:</span>
                <code className="bg-white px-2 py-1 rounded font-mono text-sm">
                  {basicTest.ip}
                </code>
                <button
                  onClick={copyIP}
                  className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                >
                  {copiedIP ? (
                    <CheckCircle size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Location Info */}
              {basicTest.location && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>
                      {basicTest.location.city}, {basicTest.location.region}, {basicTest.location.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{basicTest.location.timezone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    <span>{basicTest.location.isp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} />
                    <span>{basicTest.location.as}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {basicTest.status === 'failed' && (
            <div className="text-sm">
              <strong>Error:</strong> {basicTest.error}
            </div>
          )}
        </div>
      )}

      {/* Performance Test Results */}
      {performanceTest && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Zap size={20} />
            Performance Metrics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Latency */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {performanceTest.tests.latency.length > 0 
                  ? Math.round(performanceTest.tests.latency.reduce((a, b) => a + b, 0) / performanceTest.tests.latency.length)
                  : 0}ms
              </div>
              <div className="text-sm text-gray-600">Avg Latency</div>
            </div>

            {/* Download Speed */}
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Download size={20} />
                {performanceTest.tests.downloadSpeed.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Mbps Down</div>
            </div>

            {/* Upload Speed */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                <Upload size={20} />
                {performanceTest.tests.uploadSpeed.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Mbps Up</div>
            </div>

            {/* Reliability */}
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {performanceTest.reliability.successRate.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Latency Tests</h4>
              <div className="space-y-1">
                {performanceTest.tests.latency.map((latency, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Test {index + 1}:</span>
                    <span className={latency < 100 ? 'text-green-600' : latency < 200 ? 'text-yellow-600' : 'text-red-600'}>
                      {formatLatency(latency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Connection Metrics</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>DNS Resolution:</span>
                  <span>{performanceTest.tests.dnsResolution.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL Handshake:</span>
                  <span>{performanceTest.tests.sslHandshake.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Response:</span>
                  <span>{performanceTest.reliability.avgResponseTime.toFixed(0)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tests:</span>
                  <span>{performanceTest.reliability.totalTests}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trace Route Results */}
      {traceRoute && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Route size={20} />
            Network Trace Route
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {traceRoute.map((hop) => (
              <div key={hop.hop} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-mono">{hop.hop}</span>
                  <code className="font-mono">{hop.ip}</code>
                  {hop.hostname && (
                    <span className="text-gray-600">{hop.hostname}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {hop.location && (
                    <span className="text-gray-600">{hop.location}</span>
                  )}
                  <span className={`font-medium ${
                    hop.rtt < 50 ? 'text-green-600' : 
                    hop.rtt < 100 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {hop.rtt.toFixed(0)}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};