import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, CircularProgress } from '@mui/material';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
  location: string;
  height?: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const LocationMap: React.FC<LocationMapProps> = ({ location, height = 300 }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // Enhanced geocoding function with Korean address support
  const geocodeLocation = async (locationName: string): Promise<Coordinates | null> => {
    try {
      // Generate multiple search strategies for Korean addresses
      const searchStrategies: string[] = [];
      
      // Original address
      searchStrategies.push(locationName);
      
      // If it contains Korean characters, try different approaches
      if (/[가-힣]/.test(locationName)) {
        // Remove building names, store names, and other detailed info
        let cleanedAddress = locationName
          // Remove common building suffixes
          .replace(/\s+(빌딩|건물|타워|센터|플라자|상가|몰|마트|점|아울렛|백화점|쇼핑센터|복합쇼핑몰)(\s|$)/g, '')
          // Remove store/brand names (Korean + English patterns)
          .replace(/\s+[A-Za-z가-힣]+[A-Za-z가-힣\s]*점(\s|$)/g, '')
          .replace(/\s+[A-Za-z가-힣]+[A-Za-z가-힣\s]*센터(\s|$)/g, '')
          .replace(/\s+[A-Za-z가-힣]+[A-Za-z가-힣\s]*마트(\s|$)/g, '')
          .replace(/\s+[A-Za-z가-힣]+[A-Za-z가-힣\s]*아울렛(\s|$)/g, '')
          // Remove floor information
          .replace(/\s+\d+층(\s|$)/g, '')
          .replace(/\s+지하\d+층(\s|$)/g, '')
          // Remove detailed address info after numbers
          .replace(/(\d+)\s+[가-힣A-Za-z\s]+$/, '$1')
          .trim();
        
        if (cleanedAddress !== locationName && cleanedAddress.length > 0) {
          searchStrategies.push(cleanedAddress);
          searchStrategies.push(`${cleanedAddress}, 대한민국`);
        }
        
        // Remove everything after the street number (도로명주소 기준)
        const roadAddressMatch = locationName.match(/^([가-힣\s]+(시|군|구)\s+[가-힣\s]+로\s+\d+)/);
        if (roadAddressMatch) {
          const roadOnly = roadAddressMatch[1];
          searchStrategies.push(roadOnly);
          searchStrategies.push(`${roadOnly}, 대한민국`);
        }
        
        // Try with just the road name (without number)
        const roadNameMatch = locationName.match(/([가-힣\s]+(시|군|구)\s+[가-힣\s]+로)/);
        if (roadNameMatch) {
          const roadNameOnly = roadNameMatch[1];
          searchStrategies.push(`${roadNameOnly}, 대한민국`);
        }
        
        // Normalize common Korean address patterns
        let normalizedLocation = locationName
          .replace('서울특별시', '서울')
          .replace('부산광역시', '부산')
          .replace('대구광역시', '대구')
          .replace('인천광역시', '인천')
          .replace('광주광역시', '광주')
          .replace('대전광역시', '대전')
          .replace('울산광역시', '울산')
          .replace('세종특별자치시', '세종');
        
        if (normalizedLocation !== locationName) {
          searchStrategies.push(normalizedLocation);
          searchStrategies.push(`${normalizedLocation}, 대한민국`);
          
          // Apply cleaning to normalized location too
          let cleanedNormalized = normalizedLocation
            .replace(/\s+(빌딩|건물|타워|센터|플라자|상가|몰|마트|점|아울렛|백화점|쇼핑센터|복합쇼핑몰)(\s|$)/g, '')
            .replace(/\s+[A-Za-z가-힣]+[A-Za-z가-힣\s]*점(\s|$)/g, '')
            .replace(/(\d+)\s+[가-힣A-Za-z\s]+$/, '$1')
            .trim();
          
          if (cleanedNormalized !== normalizedLocation && cleanedNormalized.length > 0) {
            searchStrategies.push(cleanedNormalized);
            searchStrategies.push(`${cleanedNormalized}, 대한민국`);
          }
        }
        
        // Add South Korea context to original
        searchStrategies.push(`${locationName}, 대한민국`);
        searchStrategies.push(`${locationName}, South Korea`);        // Extract major location parts (시, 구, 동) with more patterns
        const cityMatch = locationName.match(/([가-힣]+시)/);
        const districtMatch = locationName.match(/([가-힣]+구)/);
        const dongMatch = locationName.match(/([가-힣]+동)/);
        const countryMatch = locationName.match(/([가-힣]+군)/);
        
        // Try different combinations of administrative divisions
        if (cityMatch && districtMatch && dongMatch) {
          searchStrategies.push(`${cityMatch[1]} ${districtMatch[1]} ${dongMatch[1]}, 대한민국`);
          searchStrategies.push(`${cityMatch[1]} ${districtMatch[1]} ${dongMatch[1]}`);
        }
        
        if (cityMatch && districtMatch) {
          searchStrategies.push(`${cityMatch[1]} ${districtMatch[1]}, 대한민국`);
          searchStrategies.push(`${cityMatch[1]} ${districtMatch[1]}`);
        }
        
        if (cityMatch && countryMatch) {
          searchStrategies.push(`${cityMatch[1]} ${countryMatch[1]}, 대한민국`);
          searchStrategies.push(`${cityMatch[1]} ${countryMatch[1]}`);
        }
        
        if (cityMatch && dongMatch) {
          searchStrategies.push(`${cityMatch[1]} ${dongMatch[1]}, 대한민국`);
        }
        
        if (cityMatch) {
          searchStrategies.push(`${cityMatch[1]}, 대한민국`);
        }
        
        // Extract and try with specific area names (송도, 강남, 홍대 etc.)
        const areaMatches = locationName.match(/([가-힣]+동|[가-힣]+로|[가-힣]{2,4}(지구|신도시|단지))/g);
        if (areaMatches && cityMatch) {
          for (const area of areaMatches) {
            if (!area.includes('광역시') && !area.includes('특별시')) {
              searchStrategies.push(`${cityMatch[1]} ${area}, 대한민국`);
            }
          }
        }
        
        // Try with district and road name only
        const districtRoadMatch = locationName.match(/([가-힣]+구)\s+([가-힣]+로)/);
        if (districtRoadMatch && cityMatch) {
          searchStrategies.push(`${cityMatch[1]} ${districtRoadMatch[1]} ${districtRoadMatch[2]}, 대한민국`);
        }
          // Try with major cities and special areas
        const majorCities = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종'];
        const specialAreas = ['송도', '강남', '홍대', '명동', '이태원', '압구정', '청담', '판교', '분당', '일산', '평촌', '안양', '수원', '성남'];
        
        for (const city of majorCities) {
          if (locationName.includes(city)) {
            searchStrategies.push(`${city}, 대한민국`);
            searchStrategies.push(`${city}, South Korea`);
            
            // Try combining with special areas
            for (const area of specialAreas) {
              if (locationName.includes(area)) {
                searchStrategies.push(`${city} ${area}, 대한민국`);
                break;
              }
            }
            break;
          }
        }
        
        // Try standalone special areas
        for (const area of specialAreas) {
          if (locationName.includes(area)) {
            searchStrategies.push(`${area}, 대한민국`);
            searchStrategies.push(`${area}, South Korea`);
            break;
          }
        }      
      }
      
      // Remove duplicates and empty strings, prioritize more specific searches first
      const uniqueStrategies = Array.from(new Set(searchStrategies.filter(s => s.trim().length > 0)));
      
      // Reorder: put cleaned addresses first, then original, then broader searches
      const prioritizedStrategies: string[] = [];
      const broadSearches: string[] = [];
      
      for (const strategy of uniqueStrategies) {
        if (strategy.includes('로 ') && /\d+/.test(strategy)) {
          // Road addresses with numbers - highest priority
          prioritizedStrategies.unshift(strategy);
        } else if (strategy.includes('구') && strategy.includes('동')) {
          // District + dong - high priority
          prioritizedStrategies.push(strategy);
        } else if (strategy.includes('구') && strategy.includes('로')) {
          // District + road - high priority
          prioritizedStrategies.push(strategy);
        } else if (strategy === locationName) {
          // Original address - medium priority
          prioritizedStrategies.splice(Math.floor(prioritizedStrategies.length / 2), 0, strategy);
        } else if (strategy.match(/^[가-힣]+시?\s*,?\s*(대한민국|South Korea)$/)) {
          // City only - low priority
          broadSearches.push(strategy);
        } else {
          prioritizedStrategies.push(strategy);
        }
      }
      
      const finalStrategies = [...prioritizedStrategies, ...broadSearches];
        console.log('Prioritized search strategies:', finalStrategies);
      
      // Try each strategy until we find a result
      for (const searchQuery of finalStrategies) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3&countrycodes=kr&addressdetails=1&accept-language=ko,en`
          );
          const data = await response.json();
          
          console.log(`Search result for "${searchQuery}":`, data);
          
          if (data && data.length > 0) {
            // Find the best match - prefer more specific results
            let bestMatch = data[0];
            
            for (const result of data) {
              // Prefer results with higher importance or that contain city/district info
              if (result.importance > bestMatch.importance || 
                  (result.display_name && result.display_name.includes('구')) ||
                  (result.address && (result.address.city || result.address.town))) {
                bestMatch = result;
              }
            }
            
            const coords = {
              lat: parseFloat(bestMatch.lat),
              lng: parseFloat(bestMatch.lon)
            };
            
            console.log('Found coordinates:', coords);
            return coords;
          }
        } catch (searchError) {
          console.error(`Error with search query "${searchQuery}":`, searchError);
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      setLoading(true);
      setError(null);
      
      const coords = await geocodeLocation(location);
      if (coords) {
        setCoordinates(coords);
      } else {
        setError('위치를 찾을 수 없습니다.');
      }
      setLoading(false);
    };

    if (location) {
      fetchCoordinates();
    } else {
      setLoading(false);
      setError('위치 정보가 없습니다.');
    }
  }, [location]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }
  if (error || !coordinates) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          flexDirection: 'column',
          p: 2
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {error || '지도를 표시할 수 없습니다'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
          위치: {location}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
          💡 팁: '서울특별시 강남구', '부산광역시 해운대구'와 같은 형식을 사용해보세요
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, borderRadius: 1, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {location}
            </Typography>
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default LocationMap;
