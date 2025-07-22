// NASA API utilities for space and science data
import axios from 'axios';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov';

// Fetch Astronomy Picture of the Day
export async function fetchAPOD(date = null) {
  const url = `${NASA_BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}${date ? `&date=${date}` : ''}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('NASA APOD error:', error);
    return null;
  }
}

// Fetch Near Earth Objects (Asteroids)
export async function fetchNEOs(startDate = null, endDate = null) {
  const today = new Date();
  const start = startDate || today.toISOString().split('T')[0];
  const end = endDate || start;
  
  const url = `${NASA_BASE_URL}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('NASA NEO error:', error);
    return null;
  }
}

// Fetch Mars Rover Photos
export async function fetchMarsPhotos(rover = 'curiosity', sol = 1000) {
  const url = `${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    return response.data.photos || [];
  } catch (error) {
    console.error('NASA Mars photos error:', error);
    return [];
  }
}

// Fetch Earth Imagery
export async function fetchEarthImagery(lat, lon, date = null, dim = 0.15) {
  const imageDate = date || new Date().toISOString().split('T')[0];
  const url = `${NASA_BASE_URL}/planetary/earth/imagery?lon=${lon}&lat=${lat}&date=${imageDate}&dim=${dim}&api_key=${NASA_API_KEY}`;
  
  try {
    return url; // Returns the direct image URL
  } catch (error) {
    console.error('NASA Earth imagery error:', error);
    return null;
  }
}

// Fetch ISS Current Location
export async function fetchISSLocation() {
  const url = 'http://api.open-notify.org/iss-now.json';
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('ISS location error:', error);
    return null;
  }
}

// Fetch upcoming space launches (using Launch Library API)
export async function fetchUpcomingLaunches(limit = 10) {
  const url = `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=${limit}`;
  
  try {
    const response = await axios.get(url);
    return response.data.results || [];
  } catch (error) {
    console.error('Launch data error:', error);
    return [];
  }
}

// Fetch solar system data
export async function fetchSolarSystemData() {
  // This would typically require a more specialized API
  // For now, return structured data about planets
  return [
    { name: 'Mercury', distance: 0.39, mass: 0.055, radius: 0.383 },
    { name: 'Venus', distance: 0.72, mass: 0.815, radius: 0.949 },
    { name: 'Earth', distance: 1.0, mass: 1.0, radius: 1.0 },
    { name: 'Mars', distance: 1.52, mass: 0.107, radius: 0.532 },
    { name: 'Jupiter', distance: 5.20, mass: 317.8, radius: 11.21 },
    { name: 'Saturn', distance: 9.58, mass: 95.2, radius: 9.45 },
    { name: 'Uranus', distance: 19.20, mass: 14.5, radius: 4.01 },
    { name: 'Neptune', distance: 30.05, mass: 17.1, radius: 3.88 }
  ];
}
