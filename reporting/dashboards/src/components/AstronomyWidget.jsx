import React, { useState, useEffect } from 'react';
import { FiStar, FiCalendar, FiGlobe, FiCamera } from 'react-icons/fi';

const AstronomyWidget = () => {
  const [apodData, setApodData] = useState(null);
  const [spaceXData, setSpaceXData] = useState(null);
  const [astronomyEvents, setAstronomyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data since we don't have real API keys
    const mockApodData = {
      title: "The Heart and Soul Nebulae",
      explanation: "Beautiful star-forming regions in the constellation Cassiopeia, captured by the Hubble Space Telescope. These nebulae showcase the birth of new stars in stunning detail.",
      url: "https://apod.nasa.gov/apod/image/2407/heart_soul_nebulae.jpg",
      hdurl: "https://apod.nasa.gov/apod/image/2407/heart_soul_nebulae_hd.jpg",
      date: new Date().toISOString().split('T')[0],
      media_type: "image"
    };

    const mockSpaceXData = {
      name: "Starlink Group 6-8",
      date_utc: "2025-07-22T10:30:00.000Z",
      rocket: "Falcon 9",
      launchpad: "Kennedy Space Center LC-39A",
      success: null,
      details: "Deployment of 23 Starlink satellites to low Earth orbit."
    };

    const mockAstronomyEvents = [
      {
        date: "2025-07-25",
        event: "New Moon",
        description: "Perfect time for deep-sky observation",
        type: "lunar"
      },
      {
        date: "2025-07-28",
        event: "Delta Aquarids Meteor Shower Peak",
        description: "Up to 20 meteors per hour visible",
        type: "meteor"
      },
      {
        date: "2025-08-02",
        event: "Saturn at Opposition",
        description: "Best time to observe Saturn's rings",
        type: "planetary"
      },
      {
        date: "2025-08-12",
        event: "Perseid Meteor Shower Peak",
        description: "One of the best meteor showers of the year",
        type: "meteor"
      }
    ];

    setApodData(mockApodData);
    setSpaceXData(mockSpaceXData);
    setAstronomyEvents(mockAstronomyEvents);
    setLoading(false);
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'lunar': return '🌙';
      case 'meteor': return '☄️';
      case 'planetary': return '🪐';
      case 'solar': return '☀️';
      default: return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading astronomy data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiStar className="w-6 h-6 text-purple-400" />
          Astronomy & Space
        </h3>
        <div className="flex items-center gap-2 text-purple-400">
          <FiGlobe className="w-4 h-4" />
          <span className="text-sm">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NASA APOD */}
        {apodData && (
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 border border-purple-700">
            <div className="flex items-center gap-2 mb-4">
              <FiCamera className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-semibold">NASA Picture of the Day</h4>
            </div>
            
            <div className="mb-4">
              <img 
                src={apodData.url} 
                alt={apodData.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200/1a1a2e/ffffff?text=Space+Image';
                }}
              />
            </div>
            
            <h5 className="text-white font-semibold mb-2">{apodData.title}</h5>
            <p className="text-gray-300 text-sm line-clamp-4">{apodData.explanation}</p>
            <p className="text-purple-400 text-xs mt-2">{apodData.date}</p>
          </div>
        )}

        {/* SpaceX Next Launch */}
        {spaceXData && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-semibold">Next SpaceX Launch</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-white font-semibold text-lg">{spaceXData.name}</h5>
                <p className="text-gray-400 text-sm">{spaceXData.details}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs">Launch Date</p>
                  <p className="text-white text-sm">
                    {new Date(spaceXData.date_utc).toLocaleDateString()}
                  </p>
                  <p className="text-blue-400 text-sm">
                    {new Date(spaceXData.date_utc).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Rocket</p>
                  <p className="text-white text-sm">{spaceXData.rocket}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-400 text-xs">Launch Site</p>
                <p className="text-white text-sm">{spaceXData.launchpad}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-green-400 text-sm">🚀 Upcoming</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Watch Live →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Astronomy Events Calendar */}
      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-yellow-400" />
          Upcoming Astronomy Events
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {astronomyEvents.map((event, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-white font-semibold text-sm">{event.event}</h5>
                    <span className="text-yellow-400 text-xs">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{event.description}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'meteor' ? 'bg-orange-900 text-orange-300' :
                      event.type === 'lunar' ? 'bg-blue-900 text-blue-300' :
                      event.type === 'planetary' ? 'bg-purple-900 text-purple-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moon Phase and Planetary Positions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🌓</div>
          <h5 className="text-white font-semibold">Moon Phase</h5>
          <p className="text-gray-400 text-sm">Waxing Crescent</p>
          <p className="text-yellow-400 text-xs">47% Illuminated</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">☀️</div>
          <h5 className="text-white font-semibold">Solar Activity</h5>
          <p className="text-gray-400 text-sm">Moderate</p>
          <p className="text-green-400 text-xs">Aurora possible at high latitudes</p>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-4xl mb-2">🌌</div>
          <h5 className="text-white font-semibold">Best Viewing</h5>
          <p className="text-gray-400 text-sm">Tonight</p>
          <p className="text-purple-400 text-xs">Jupiter & Saturn visible</p>
        </div>
      </div>
    </div>
  );
};

export default AstronomyWidget;
