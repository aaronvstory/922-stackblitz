import { ProxyConfig } from '../types/proxy';

export const exportProxies = (proxies: ProxyConfig[], format: 'csv' | 'txt' | 'json') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `proxies-${timestamp}.${format}`;
  
  let content = '';
  let mimeType = 'text/plain';
  
  switch (format) {
    case 'csv':
      mimeType = 'text/csv';
      content = 'Domain,Port,Username,Password,Protocol,Country,State,City,ASN\n';
      content += proxies.map(p => 
        `${p.domain},${p.port},${p.username},${p.password},${p.protocol},${p.country},${p.state || ''},${p.city || ''},${p.asn || ''}`
      ).join('\n');
      break;
      
    case 'txt':
      content = proxies.map(p => `${p.domain}:${p.port}:${p.username}:${p.password}`).join('\n');
      break;
      
    case 'json':
      mimeType = 'application/json';
      content = JSON.stringify(proxies, null, 2);
      break;
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};