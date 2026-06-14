// Curated birth-place list with coordinates + UTC offset — needed for the Lagna
// (ascendant), which depends on exact latitude, longitude and time zone.
// Offsets are standard time; India is always +5.5 (no DST).

export interface City {
  name: string;
  region: string;
  lat: number;
  lng: number;  // positive East
  tz: number;   // standard UTC offset (hours)
}

export const CITIES: City[] = [
  // Kashmir
  { name: 'Srinagar', region: 'J&K', lat: 34.0837, lng: 74.7973, tz: 5.5 },
  { name: 'Anantnag', region: 'J&K', lat: 33.7311, lng: 75.1487, tz: 5.5 },
  { name: 'Baramulla', region: 'J&K', lat: 34.1980, lng: 74.3636, tz: 5.5 },
  { name: 'Jammu', region: 'J&K', lat: 32.7266, lng: 74.8570, tz: 5.5 },
  // North India
  { name: 'Delhi', region: 'India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'New Delhi', region: 'India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'Chandigarh', region: 'India', lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { name: 'Amritsar', region: 'India', lat: 31.6340, lng: 74.8723, tz: 5.5 },
  { name: 'Ludhiana', region: 'India', lat: 30.9010, lng: 75.8573, tz: 5.5 },
  { name: 'Shimla', region: 'India', lat: 31.1048, lng: 77.1734, tz: 5.5 },
  { name: 'Dehradun', region: 'India', lat: 30.3165, lng: 78.0322, tz: 5.5 },
  { name: 'Lucknow', region: 'India', lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: 'Kanpur', region: 'India', lat: 26.4499, lng: 80.3319, tz: 5.5 },
  { name: 'Varanasi', region: 'India', lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: 'Prayagraj', region: 'India', lat: 25.4358, lng: 81.8463, tz: 5.5 },
  { name: 'Jaipur', region: 'India', lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: 'Jodhpur', region: 'India', lat: 26.2389, lng: 73.0243, tz: 5.5 },
  { name: 'Agra', region: 'India', lat: 27.1767, lng: 78.0081, tz: 5.5 },
  { name: 'Gurugram', region: 'India', lat: 28.4595, lng: 77.0266, tz: 5.5 },
  { name: 'Noida', region: 'India', lat: 28.5355, lng: 77.3910, tz: 5.5 },
  // West India
  { name: 'Mumbai', region: 'India', lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: 'Pune', region: 'India', lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: 'Nagpur', region: 'India', lat: 21.1458, lng: 79.0882, tz: 5.5 },
  { name: 'Ahmedabad', region: 'India', lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: 'Surat', region: 'India', lat: 21.1702, lng: 72.8311, tz: 5.5 },
  { name: 'Indore', region: 'India', lat: 22.7196, lng: 75.8577, tz: 5.5 },
  { name: 'Bhopal', region: 'India', lat: 23.2599, lng: 77.4126, tz: 5.5 },
  // South India
  { name: 'Bengaluru', region: 'India', lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: 'Hyderabad', region: 'India', lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: 'Chennai', region: 'India', lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: 'Kochi', region: 'India', lat: 9.9312, lng: 76.2673, tz: 5.5 },
  { name: 'Thiruvananthapuram', region: 'India', lat: 8.5241, lng: 76.9366, tz: 5.5 },
  { name: 'Mysuru', region: 'India', lat: 12.2958, lng: 76.6394, tz: 5.5 },
  // East India
  { name: 'Kolkata', region: 'India', lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: 'Patna', region: 'India', lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: 'Guwahati', region: 'India', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Bhubaneswar', region: 'India', lat: 20.2961, lng: 85.8245, tz: 5.5 },
  { name: 'Ranchi', region: 'India', lat: 23.3441, lng: 85.3096, tz: 5.5 },
  // Diaspora
  { name: 'Dubai', region: 'UAE', lat: 25.2048, lng: 55.2708, tz: 4 },
  { name: 'London', region: 'UK', lat: 51.5074, lng: -0.1278, tz: 0 },
  { name: 'Toronto', region: 'Canada', lat: 43.6532, lng: -79.3832, tz: -5 },
  { name: 'New York', region: 'USA', lat: 40.7128, lng: -74.0060, tz: -5 },
  { name: 'New Jersey', region: 'USA', lat: 40.0583, lng: -74.4057, tz: -5 },
  { name: 'San Jose', region: 'USA', lat: 37.3382, lng: -121.8863, tz: -8 },
  { name: 'Sydney', region: 'Australia', lat: -33.8688, lng: 151.2093, tz: 10 },
  { name: 'Singapore', region: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 8 },
];

export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)).slice(0, limit);
}

export function findCity(name: string): City | undefined {
  return CITIES.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
}
