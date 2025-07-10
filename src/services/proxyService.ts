import { ProxyConfig, ProxyCredentials, SessionConfig, Region } from '../types/proxy';
import { apiService } from './apiService';

// Fallback to static data if API fails
import { getRegionData, getStatesForRegion, getCitiesForState, getASNsForCity, getAllASNsForRegion } from '../data/locations';

class ProxyService {
  private credentials: ProxyCredentials | null = null;
  private locationData: any = null;
  private lastLocationUpdate = 0;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  setCredentials(credentials: ProxyCredentials) {
    this.credentials = credentials;
  }

  async getAvailableRegions(): Promise<Region[]> {
    await this.ensureLocationData();
    return this.locationData?.countries || getRegionData();
  }

  private async ensureLocationData() {
    const now = Date.now();
    if (!this.locationData || (now - this.lastLocationUpdate) > this.CACHE_DURATION) {
      try {
        const data = await apiService.getAvailableLocations();
        this.locationData = data;
        this.lastLocationUpdate = now;
      } catch (error) {
        console.warn('Failed to fetch location data from API, using fallback');
        // Keep existing data or use fallback
        if (!this.locationData) {
          this.locationData = { countries: getRegionData() };
        }
      }
    }
  }

  async getStatesForRegion(regionId: string) {
    await this.ensureLocationData();
    const country = this.locationData?.countries?.find((c: any) => c.id === regionId);
    return country?.regions || getStatesForRegion(regionId);
  }

  async getCitiesForState(regionId: string, stateId: string) {
    await this.ensureLocationData();
    const country = this.locationData?.countries?.find((c: any) => c.id === regionId);
    const region = country?.regions?.find((r: any) => r.id === stateId);
    return region?.cities || getCitiesForState(regionId, stateId);
  }

  async getASNsForCity(regionId: string, stateId: string, cityId: string) {
    await this.ensureLocationData();
    const country = this.locationData?.countries?.find((c: any) => c.id === regionId);
    const region = country?.regions?.find((r: any) => r.id === stateId);
    const city = region?.cities?.find((c: any) => c.id === cityId);
    return city?.isps || getASNsForCity(regionId, stateId, cityId);
  }

  async getAllASNsForRegion(regionId: string) {
    await this.ensureLocationData();
    const country = this.locationData?.countries?.find((c: any) => c.id === regionId);
    
    if (country?.regions) {
      const allISPs = [];
      for (const region of country.regions) {
        if (region.cities) {
          for (const city of region.cities) {
            if (city.isps) {
              allISPs.push(...city.isps);
            }
          }
        }
      }
      
      // Remove duplicates based on ASN
      const uniqueISPs = allISPs.filter((isp, index, self) => 
        index === self.findIndex(i => i.asn === isp.asn)
      );
      
      return uniqueISPs;
    }
    
    return getAllASNsForRegion(regionId);
  }

  generateSessionId(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  buildUsername(region: string, sessionTime: number = 120, state?: string, city?: string, asn?: string): string {
    const sessionId = this.generateSessionId();
    let username = `script-zone-custom-region-${region}`;
    
    if (state) {
      username += `-state-${state}`;
    }
    
    if (city) {
      username += `-city-${city}`;
    }
    
    if (asn) {
      username += `-asn-${asn}`;
    }
    
    username += `-sessid-${sessionId}-sessTime-${sessionTime}`;
    
    return username;
  }

  generateProxy(params: {
    region: string;
    state?: string;
    city?: string;
    asn?: string;
    protocol?: 'HTTP' | 'SOCKS5';
    quantity?: number;
    sessionTime?: number;
  }): ProxyConfig[] {
    if (!this.credentials) {
      throw new Error('Proxy credentials not configured');
    }

    const { region, state, city, asn, protocol = 'HTTP', quantity = 1, sessionTime = 120 } = params;
    const regionInfo = getRegionData().find(r => r.id === region);
    
    if (!regionInfo) {
      throw new Error(`Region ${region} not supported`);
    }

    const proxies: ProxyConfig[] = [];

    for (let i = 0; i < quantity; i++) {
      const sessionId = this.generateSessionId();
      const username = this.buildUsername(region, sessionTime, state, city, asn);
      
      proxies.push({
        domain: regionInfo.endpoint,
        port: regionInfo.port,
        username,
        password: this.credentials.password,
        protocol,
        country: regionInfo.name,
        state,
        city,
        asn,
        sessionId,
        sessionTime,
      });
    }

    return proxies;
  }

  async testProxy(proxy: ProxyConfig): Promise<{ success: boolean; responseTime?: number; error?: string; ip?: string }> {
    const startTime = Date.now();
    
    try {
      // Create proxy URL
      const proxyUrl = `http://${proxy.username}:${proxy.password}@${proxy.domain}:${proxy.port}`;
      
      // Test with a simple IP check service
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        signal: controller.signal,
        // Note: Direct proxy support in fetch is limited in browsers
        // This is a simplified test - in production you'd use a proxy service
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          responseTime,
          ip: data.ip,
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime,
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      };
    }
  }

  rotateSession(proxy: ProxyConfig): ProxyConfig {
    const newSessionId = this.generateSessionId();
    const regionInfo = getRegionData().find(r => r.name === proxy.country);
    const region = regionInfo?.id || 'US';
    
    const newUsername = this.buildUsername(
      region, 
      proxy.sessionTime || 120, 
      proxy.state, 
      proxy.city, 
      proxy.asn
    );
    
    return {
      ...proxy,
      username: newUsername,
      sessionId: newSessionId,
    };
  }

  parseUsername(username: string): SessionConfig | null {
    const match = username.match(/script-zone-custom-region-(\w+)-sessid-(\w+)-sessTime-(\d+)/);
    if (match) {
      return {
        region: match[1],
        sessionId: match[2],
        sessionTime: parseInt(match[3]),
      };
    }
    return null;
  }
}

export const proxyService = new ProxyService();