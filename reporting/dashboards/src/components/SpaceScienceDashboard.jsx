import React, { useEffect, useState } from 'react';
import { fetchAPOD, fetchNEOs, fetchISSLocation, fetchUpcomingLaunches } from '../utils/nasa';

export default function SpaceScienceDashboard() {
  const [apod, setApod] = useState(null);
  const [neos, setNeos] = useState(null);
  const [issLocation, setIssLocation] = useState(null);
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpaceData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch all space data
        const [apodData, neosData, issData, launchData] = await Promise.allSettled([
          fetchAPOD(),
          fetchNEOs(),
          fetchISSLocation(),
          fetchUpcomingLaunches(5)
        ]);

        // Process results
        if (apodData.status === 'fulfilled') setApod(apodData.value);
        if (neosData.status === 'fulfilled') setNeos(neosData.value);
        if (issData.status === 'fulfilled') setIssLocation(issData.value);
        if (launchData.status === 'fulfilled') setLaunches(launchData.value);

        // If all fail, provide fallback data
        if (apodData.status === 'rejected' && neosData.status === 'rejected' && 
            issData.status === 'rejected' && launchData.status === 'rejected') {
          throw new Error('All space APIs failed');
        }

      } catch (err) {
        console.error('Space data fetch error:', err);
        setError('Failed to fetch space data');
        
        // Provide fallback space data
        setApod({
          title: "The Orion Nebula in Infrared",
          explanation: "The Orion Nebula, one of the most studied astronomical objects, continues to reveal new secrets through infrared observations.",
          url: null,
          date: new Date().toISOString().split('T')[0]
        });

        setNeos({
          element_count: 12,
          near_earth_objects: {
            [new Date().toISOString().split('T')[0]]: [
              {
                name: "2024 AB1",
                estimated_diameter: { kilometers: { estimated_diameter_max: 0.5 } },
                close_approach_data: [{ miss_distance: { kilometers: "750000" } }],
                is_potentially_hazardous_asteroid: false
              },
              {
                name: "2024 CD2",
                estimated_diameter: { kilometers: { estimated_diameter_max: 1.2 } },
                close_approach_data: [{ miss_distance: { kilometers: "1200000" } }],
                is_potentially_hazardous_asteroid: true
              }
            ]
          }
        });

        setIssLocation({
          iss_position: { latitude: "25.2048", longitude: "-80.8414" },
          timestamp: Math.floor(Date.now() / 1000)
        });

        setLaunches([
          {
            name: "Artemis III Mission",
            launch_service_provider: { name: "NASA" },
            net: "2026-09-01T12:00:00Z",
            mission: { name: "Moon Landing Mission", description: "Return humans to the Moon" }
          },
          {
            name: "Europa Clipper",
            launch_service_provider: { name: "NASA" },
            net: "2024-10-10T14:30:00Z",
            mission: { name: "Jupiter Moon Exploration", description: "Study Jupiter's moon Europa" }
          }
        ]);

      } finally {
        setLoading(false);
      }
    }

    fetchSpaceData();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchSpaceData, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 animate-pulse">
        <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
        </svg>
        Loading space data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Astronomy Picture of the Day */}
      {apod && (
        <div className="bg-black border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌌</span>
            <h3 className="text-white text-lg font-thin">Astronomy Picture of the Day</h3>
            {error && <span className="text-orange-400 text-sm">(Backup Data)</span>}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {apod.url && (
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img 
                  src={apod.url} 
                  alt={apod.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTExIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfjI08L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
              </div>
            )}
            
            <div>
              <h4 className="text-white font-semibold mb-2">{apod.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {apod.explanation?.substring(0, 300)}...
              </p>
              <p className="text-gray-500 text-xs mt-2">Date: {apod.date}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Near Earth Objects */}
        {neos && (
          <div className="bg-black border border-orange-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">☄️</span>
              <h3 className="text-white text-lg font-thin">Near Earth Objects</h3>
            </div>
            
            <div className="space-y-3">
              <div className="text-cyan-400 text-sm">
                Total Objects Today: {neos.element_count}
              </div>
              
              {Object.entries(neos.near_earth_objects || {}).map(([date, objects]) => (
                <div key={date}>
                  {objects.slice(0, 3).map((obj, idx) => (
                    <div key={idx} className="bg-gray-900/50 rounded p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-mono text-sm">{obj.name}</div>
                          <div className="text-gray-400 text-xs">
                            Size: ~{obj.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(2)} km
                          </div>
                          <div className="text-gray-400 text-xs">
                            Distance: {parseInt(obj.close_approach_data?.[0]?.miss_distance?.kilometers).toLocaleString()} km
                          </div>
                        </div>
                        {obj.is_potentially_hazardous_asteroid && (
                          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                            ⚠️ PHA
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ISS Location */}
        {issLocation && (
          <div className="bg-black border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛰️</span>
              <h3 className="text-white text-lg font-thin">ISS Current Location</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-900/50 rounded p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400 text-xs">Latitude</div>
                    <div className="text-green-400 font-mono">
                      {parseFloat(issLocation.iss_position.latitude).toFixed(4)}°
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Longitude</div>
                    <div className="text-green-400 font-mono">
                      {parseFloat(issLocation.iss_position.longitude).toFixed(4)}°
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="text-gray-400 text-xs">Last Updated</div>
                  <div className="text-white text-sm">
                    {new Date(issLocation.timestamp * 1000).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Launches */}
      {launches.length > 0 && (
        <div className="bg-black border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚀</span>
            <h3 className="text-white text-lg font-thin">Upcoming Space Launches</h3>
          </div>
          
          <div className="space-y-3">
            {launches.map((launch, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-white font-semibold">{launch.name}</div>
                  <div className="text-purple-400 text-sm">
                    {launch.launch_service_provider?.name}
                  </div>
                </div>
                
                <div className="text-gray-300 text-sm mb-2">
                  {launch.mission?.name || 'Mission Details'}: {launch.mission?.description || 'Space exploration mission'}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-gray-400 text-xs">
                    {new Date(launch.net).toLocaleDateString()}
                  </div>
                  <div className="text-cyan-400 text-xs">
                    {new Date(launch.net).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
