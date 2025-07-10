import { Region } from '../types/proxy';

export const locationData: Region[] = [
  {
    id: 'US',
    name: 'United States',
    code: 'US',
    endpoint: 'na.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'CA',
        name: 'California',
        code: 'CA',
        cities: [
          {
            id: 'los-angeles',
            name: 'Los Angeles',
            asns: [
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as22773', name: 'Cox Communications', number: '22773', provider: 'Cox' },
            ]
          },
          {
            id: 'san-francisco',
            name: 'San Francisco',
            asns: [
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as6939', name: 'Hurricane Electric', number: '6939', provider: 'Hurricane Electric' },
            ]
          },
          {
            id: 'san-diego',
            name: 'San Diego',
            asns: [
              { id: 'as22773', name: 'Cox Communications', number: '22773', provider: 'Cox' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
            ]
          }
        ]
      },
      {
        id: 'NY',
        name: 'New York',
        code: 'NY',
        cities: [
          {
            id: 'new-york-city',
            name: 'New York City',
            asns: [
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as6128', name: 'Cablevision Systems', number: '6128', provider: 'Optimum' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as701', name: 'Verizon Business', number: '701', provider: 'Verizon' },
            ]
          },
          {
            id: 'buffalo',
            name: 'Buffalo',
            asns: [
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as701', name: 'Verizon Business', number: '701', provider: 'Verizon' },
            ]
          }
        ]
      },
      {
        id: 'TX',
        name: 'Texas',
        code: 'TX',
        cities: [
          {
            id: 'houston',
            name: 'Houston',
            asns: [
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
            ]
          },
          {
            id: 'dallas',
            name: 'Dallas',
            asns: [
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
            ]
          },
          {
            id: 'austin',
            name: 'Austin',
            asns: [
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
            ]
          }
        ]
      },
      {
        id: 'FL',
        name: 'Florida',
        code: 'FL',
        cities: [
          {
            id: 'miami',
            name: 'Miami',
            asns: [
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
            ]
          },
          {
            id: 'orlando',
            name: 'Orlando',
            asns: [
              { id: 'as20001', name: 'Charter Communications', number: '20001', provider: 'Spectrum' },
              { id: 'as7018', name: 'AT&T Services', number: '7018', provider: 'AT&T' },
              { id: 'as7922', name: 'Comcast Cable', number: '7922', provider: 'Comcast' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'CA',
    name: 'Canada',
    code: 'CA',
    endpoint: 'na.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'ON',
        name: 'Ontario',
        code: 'ON',
        cities: [
          {
            id: 'toronto',
            name: 'Toronto',
            asns: [
              { id: 'as812', name: 'Rogers Communications', number: '812', provider: 'Rogers' },
              { id: 'as855', name: 'Bell Canada', number: '855', provider: 'Bell' },
              { id: 'as6327', name: 'Shaw Communications', number: '6327', provider: 'Shaw' },
            ]
          },
          {
            id: 'ottawa',
            name: 'Ottawa',
            asns: [
              { id: 'as855', name: 'Bell Canada', number: '855', provider: 'Bell' },
              { id: 'as812', name: 'Rogers Communications', number: '812', provider: 'Rogers' },
            ]
          }
        ]
      },
      {
        id: 'BC',
        name: 'British Columbia',
        code: 'BC',
        cities: [
          {
            id: 'vancouver',
            name: 'Vancouver',
            asns: [
              { id: 'as6327', name: 'Shaw Communications', number: '6327', provider: 'Shaw' },
              { id: 'as855', name: 'Bell Canada', number: '855', provider: 'Bell' },
              { id: 'as812', name: 'Rogers Communications', number: '812', provider: 'Rogers' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'UK',
    name: 'United Kingdom',
    code: 'UK',
    endpoint: 'eu.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'ENG',
        name: 'England',
        code: 'ENG',
        cities: [
          {
            id: 'london',
            name: 'London',
            asns: [
              { id: 'as2856', name: 'British Telecom', number: '2856', provider: 'BT' },
              { id: 'as5607', name: 'Sky UK Limited', number: '5607', provider: 'Sky' },
              { id: 'as6871', name: 'Plusnet', number: '6871', provider: 'Plusnet' },
              { id: 'as20712', name: 'Virgin Media', number: '20712', provider: 'Virgin Media' },
            ]
          },
          {
            id: 'manchester',
            name: 'Manchester',
            asns: [
              { id: 'as2856', name: 'British Telecom', number: '2856', provider: 'BT' },
              { id: 'as20712', name: 'Virgin Media', number: '20712', provider: 'Virgin Media' },
              { id: 'as5607', name: 'Sky UK Limited', number: '5607', provider: 'Sky' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'AU',
    name: 'Australia',
    code: 'AU',
    endpoint: 'au.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'NSW',
        name: 'New South Wales',
        code: 'NSW',
        cities: [
          {
            id: 'sydney',
            name: 'Sydney',
            asns: [
              { id: 'as1221', name: 'Telstra Corporation', number: '1221', provider: 'Telstra' },
              { id: 'as4804', name: 'Microplex PTY LTD', number: '4804', provider: 'Microplex' },
              { id: 'as7545', name: 'TPG Telecom', number: '7545', provider: 'TPG' },
            ]
          }
        ]
      },
      {
        id: 'VIC',
        name: 'Victoria',
        code: 'VIC',
        cities: [
          {
            id: 'melbourne',
            name: 'Melbourne',
            asns: [
              { id: 'as1221', name: 'Telstra Corporation', number: '1221', provider: 'Telstra' },
              { id: 'as7545', name: 'TPG Telecom', number: '7545', provider: 'TPG' },
              { id: 'as4804', name: 'Microplex PTY LTD', number: '4804', provider: 'Microplex' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'DE',
    name: 'Germany',
    code: 'DE',
    endpoint: 'eu.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'BY',
        name: 'Bavaria',
        code: 'BY',
        cities: [
          {
            id: 'munich',
            name: 'Munich',
            asns: [
              { id: 'as3320', name: 'Deutsche Telekom AG', number: '3320', provider: 'Deutsche Telekom' },
              { id: 'as6805', name: 'Telefonica Germany', number: '6805', provider: 'O2' },
              { id: 'as20940', name: 'Akamai International B.V.', number: '20940', provider: 'Akamai' },
            ]
          }
        ]
      },
      {
        id: 'NW',
        name: 'North Rhine-Westphalia',
        code: 'NW',
        cities: [
          {
            id: 'cologne',
            name: 'Cologne',
            asns: [
              { id: 'as3320', name: 'Deutsche Telekom AG', number: '3320', provider: 'Deutsche Telekom' },
              { id: 'as6805', name: 'Telefonica Germany', number: '6805', provider: 'O2' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'FR',
    name: 'France',
    code: 'FR',
    endpoint: 'eu.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'IDF',
        name: 'Île-de-France',
        code: 'IDF',
        cities: [
          {
            id: 'paris',
            name: 'Paris',
            asns: [
              { id: 'as3215', name: 'Orange S.A.', number: '3215', provider: 'Orange' },
              { id: 'as12322', name: 'Free SAS', number: '12322', provider: 'Free' },
              { id: 'as21502', name: 'SFR SA', number: '21502', provider: 'SFR' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'JP',
    name: 'Japan',
    code: 'JP',
    endpoint: 'ap.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'TK',
        name: 'Tokyo',
        code: 'TK',
        cities: [
          {
            id: 'tokyo',
            name: 'Tokyo',
            asns: [
              { id: 'as2516', name: 'KDDI Corporation', number: '2516', provider: 'KDDI' },
              { id: 'as4713', name: 'NTT Communications', number: '4713', provider: 'NTT' },
              { id: 'as17676', name: 'SoftBank Corp.', number: '17676', provider: 'SoftBank' },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'SG',
    name: 'Singapore',
    code: 'SG',
    endpoint: 'ap.proxys5.net',
    port: 6200,
    states: [
      {
        id: 'SG',
        name: 'Singapore',
        code: 'SG',
        cities: [
          {
            id: 'singapore',
            name: 'Singapore',
            asns: [
              { id: 'as3758', name: 'SingTel Optus', number: '3758', provider: 'SingTel' },
              { id: 'as4657', name: 'StarHub Ltd', number: '4657', provider: 'StarHub' },
              { id: 'as10026', name: 'M1 Limited', number: '10026', provider: 'M1' },
            ]
          }
        ]
      }
    ]
  }
];

export const getRegionData = () => locationData;

export const getStatesForRegion = (regionId: string) => {
  const region = locationData.find(r => r.id === regionId);
  return region?.states || [];
};

export const getCitiesForState = (regionId: string, stateId: string) => {
  const region = locationData.find(r => r.id === regionId);
  const state = region?.states?.find(s => s.id === stateId);
  return state?.cities || [];
};

export const getASNsForCity = (regionId: string, stateId: string, cityId: string) => {
  const region = locationData.find(r => r.id === regionId);
  const state = region?.states?.find(s => s.id === stateId);
  const city = state?.cities?.find(c => c.id === cityId);
  return city?.asns || [];
};

export const getAllASNsForRegion = (regionId: string) => {
  const region = locationData.find(r => r.id === regionId);
  if (!region?.states) return [];
  
  const allASNs = [];
  for (const state of region.states) {
    if (state.cities) {
      for (const city of state.cities) {
        if (city.asns) {
          allASNs.push(...city.asns);
        }
      }
    }
  }
  
  // Remove duplicates based on ASN number
  const uniqueASNs = allASNs.filter((asn, index, self) => 
    index === self.findIndex(a => a.number === asn.number)
  );
  
  return uniqueASNs;
};