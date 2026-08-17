export interface IndianCity {
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  timezone: number; // +5.5
}

export const TOP_INDIAN_CITIES: IndianCity[] = [
  { name: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 5.5 },
  { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, timezone: 5.5 },
  { name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, timezone: 5.5 },
  { name: 'Varanasi (Kashi)', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, timezone: 5.5 },
  { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, timezone: 5.5 },
  { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, timezone: 5.5 },
  { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, timezone: 5.5 },
  { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, timezone: 5.5 },
  { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, timezone: 5.5 },
  { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, timezone: 5.5 },
  { name: 'Haridwar', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1642, timezone: 5.5 },
  { name: 'Ujjain', state: 'Madhya Pradesh', latitude: 23.1765, longitude: 75.7885, timezone: 5.5 },
  { name: 'Ayodhya', state: 'Uttar Pradesh', latitude: 26.7922, longitude: 82.1998, timezone: 5.5 },
  { name: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311, timezone: 5.5 },
  { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, timezone: 5.5 },
  { name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, timezone: 5.5 },
  { name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126, timezone: 5.5 },
  { name: 'Chandigarh', state: 'Punjab/Haryana', latitude: 30.7333, longitude: 76.7794, timezone: 5.5 },
  { name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, timezone: 5.5 },
  { name: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882, timezone: 5.5 },
  { name: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0168, longitude: 76.9558, timezone: 5.5 },
  { name: 'Kochi', state: 'Kerala', latitude: 9.9312, longitude: 76.2673, timezone: 5.5 },
  { name: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362, timezone: 5.5 },
  { name: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, timezone: 5.5 },
  { name: 'Ranchi', state: 'Jharkhand', latitude: 23.3441, longitude: 85.3096, timezone: 5.5 },
];
