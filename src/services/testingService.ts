import { ProxyConfig, ProxyTest, PerformanceTest, TraceHop } from '../types/proxy';

class TestingService {
  private testEndpoints = [
    'https://ipinfo.io/json',
    'https://api.ipify.org?format=json',
    'https://httpbin.org/ip',
    'https://api.myip.com',
  ];

  async testProxy(proxy: ProxyConfig): Promise<ProxyTest> {
    const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
    const startTime = Date.now();

    try {
      // Test basic connectivity and get IP info
      const ipInfo = await this.getProxyIPInfo(proxy);
      const responseTime = Date.now() - startTime;

      return {
        id: proxyId,
        proxy,
        status: 'success',
        ip: ipInfo.ip,
        location: ipInfo.location,
        responseTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        id: proxyId,
        proxy,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
  }

  async getProxyIPInfo(proxy: ProxyConfig) {
    // In a real implementation, this would use the proxy
    // For demo purposes, we'll simulate the response
    const mockIPs = [
      '192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.45',
      '198.51.100.78', '192.0.2.123', '203.0.113.89', '198.51.100.234'
    ];

    const mockLocations = [
      { country: 'United States', region: 'California', city: 'Los Angeles', timezone: 'America/Los_Angeles', isp: 'Comcast Cable', org: 'Comcast Cable Communications', as: 'AS7922' },
      { country: 'United States', region: 'New York', city: 'New York', timezone: 'America/New_York', isp: 'Optimum', org: 'Cablevision Systems', as: 'AS6128' },
      { country: 'United States', region: 'Texas', city: 'Dallas', timezone: 'America/Chicago', isp: 'AT&T Services', org: 'AT&T Services Inc', as: 'AS7018' },
      { country: 'Canada', region: 'Ontario', city: 'Toronto', timezone: 'America/Toronto', isp: 'Rogers Communications', org: 'Rogers Communications Canada Inc', as: 'AS812' },
      { country: 'United Kingdom', region: 'England', city: 'London', timezone: 'Europe/London', isp: 'British Telecom', org: 'BT Public Internet Service', as: 'AS2856' },
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

    const randomIP = mockIPs[Math.floor(Math.random() * mockIPs.length)];
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    return {
      ip: randomIP,
      location: randomLocation,
    };
  }

  async performanceTest(proxy: ProxyConfig): Promise<PerformanceTest> {
    const proxyId = `${proxy.domain}:${proxy.port}:${proxy.sessionId}`;
    
    // Simulate performance tests
    const latencyTests = await this.runLatencyTests(proxy, 5);
    const speedTest = await this.runSpeedTest(proxy);
    const reliabilityTest = await this.runReliabilityTest(proxy);

    return {
      id: proxyId,
      proxy,
      tests: {
        latency: latencyTests,
        downloadSpeed: speedTest.download,
        uploadSpeed: speedTest.upload,
        dnsResolution: speedTest.dns,
        sslHandshake: speedTest.ssl,
      },
      reliability: reliabilityTest,
      timestamp: Date.now(),
    };
  }

  private async runLatencyTests(proxy: ProxyConfig, count: number): Promise<number[]> {
    const results: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const startTime = Date.now();
      
      try {
        // Simulate ping test
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
        results.push(Date.now() - startTime);
      } catch {
        results.push(-1); // Failed ping
      }
    }
    
    return results;
  }

  private async runSpeedTest(proxy: ProxyConfig) {
    // Simulate speed tests
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      download: Math.random() * 100 + 20, // Mbps
      upload: Math.random() * 50 + 10,    // Mbps
      dns: Math.random() * 50 + 10,       // ms
      ssl: Math.random() * 200 + 100,     // ms
    };
  }

  private async runReliabilityTest(proxy: ProxyConfig) {
    const totalTests = 10;
    const successfulTests = Math.floor(Math.random() * 3) + 7; // 7-10 successful
    const avgResponseTime = Math.random() * 1000 + 500;
    
    return {
      successRate: (successfulTests / totalTests) * 100,
      totalTests,
      avgResponseTime,
    };
  }

  async traceRoute(proxy: ProxyConfig): Promise<TraceHop[]> {
    // Simulate traceroute
    const hops: TraceHop[] = [];
    const hopCount = Math.floor(Math.random() * 10) + 8; // 8-18 hops
    
    for (let i = 1; i <= hopCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      hops.push({
        hop: i,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        hostname: i === hopCount ? 'destination.example.com' : `hop${i}.isp.net`,
        rtt: Math.random() * 100 + 20,
        location: i < 3 ? 'Local Network' : i < hopCount - 2 ? 'ISP Network' : 'Destination Network',
      });
    }
    
    return hops;
  }

  async testMultipleEndpoints(proxy: ProxyConfig): Promise<{ [endpoint: string]: ProxyTest }> {
    const results: { [endpoint: string]: ProxyTest } = {};
    
    for (const endpoint of this.testEndpoints) {
      try {
        const test = await this.testProxy(proxy);
        results[endpoint] = {
          ...test,
          id: `${test.id}-${endpoint}`,
        };
      } catch (error) {
        results[endpoint] = {
          id: `${proxy.domain}:${proxy.port}:${proxy.sessionId}-${endpoint}`,
          proxy,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        };
      }
    }
    
    return results;
  }
}

export const testingService = new TestingService();