export interface ProxyConfig {
  domain: string;
  port: number;
  username: string;
  password: string;
  protocol: 'HTTP' | 'SOCKS5';
  country: string;
  state?: string;
  city?: string;
  asn?: string;
  sessionId?: string;
  sessionTime?: number;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  endpoint: string;
  port: number;
  states?: State[];
}

export interface State {
  id: string;
  name: string;
  code: string;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  code?: string;
  asns?: ASN[];
}

export interface ASN {
  id: string;
  name: string;
  number: string;
  provider: string;
}

export interface ApiCredentials {
  token: string;
  secret: string;
  timeout?: number;
}

export interface ProxyCredentials {
  username: string;
  password: string;
  endpoint: string;
  port: number;
}

export interface ProxyTest {
  id: string;
  proxy: ProxyConfig;
  status: 'pending' | 'success' | 'failed';
  ip?: string;
  location?: {
    country: string;
    region: string;
    city: string;
    timezone: string;
    isp: string;
    org: string;
    as: string;
  };
  responseTime?: number;
  latency?: number;
  downloadSpeed?: number;
  uploadSpeed?: number;
  trace?: TraceHop[];
  error?: string;
  timestamp: number;
}

export interface TraceHop {
  hop: number;
  ip: string;
  hostname?: string;
  rtt: number;
  location?: string;
}

export interface PerformanceTest {
  id: string;
  proxy: ProxyConfig;
  tests: {
    latency: number[];
    downloadSpeed: number;
    uploadSpeed: number;
    dnsResolution: number;
    sslHandshake: number;
  };
  reliability: {
    successRate: number;
    totalTests: number;
    avgResponseTime: number;
  };
  timestamp: number;
}

export interface LocationData {
  countries: Country[];
  lastUpdated: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  endpoint: string;
  port: number;
  regions: RegionData[];
}

export interface RegionData {
  id: string;
  name: string;
  code: string;
  cities: CityData[];
}

export interface CityData {
  id: string;
  name: string;
  code?: string;
  isps: ISPData[];
}

export interface ISPData {
  id: string;
  name: string;
  asn: string;
  type: 'residential' | 'datacenter' | 'mobile';
}
export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  asn?: string;
  createdAt: number;
}

export interface ProxyHistory {
  id: string;
  proxy: ProxyConfig;
  usedAt: number;
  successful: boolean;
}

export interface SessionConfig {
  region: string;
  sessionId: string;
  sessionTime: number;
}