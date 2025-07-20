import React, { useState, useEffect } from 'react';
import { FiActivity, FiMapPin, FiAlertTriangle, FiGlobe } from 'react-icons/fi';

const EarthquakeMonitor = () => {
  const [earthquakeData, setEarthquakeData] = useState([]);
  const [selectedMagnitude, setSelectedMagnitude] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock earthquake data based on USGS format
    const mockEarthquakeData = [
      {
        id: 'us7000k1a2',
        magnitude: 6.2,
        place: '45 km NE of Tokyo, Japan',
        time: new Date(Date.now() - 1800000).getTime(),
        coordinates: [139.7514, 35.6850, 10.2],
        depth: 10.2,
        significance: 742,
        alert: 'yellow',
        tsunami: 0,
        felt: 1250,
        type: 'earthquake'
      },
      {
        id: 'us7000k1a3',
        magnitude: 4.8,
        place: '23 km SW of Los Angeles, California',
        time: new Date(Date.now() - 3600000).getTime(),
        coordinates: [-118.4, 34.0, 8.5],
        depth: 8.5,
        significance: 364,
        alert: 'green',
        tsunami: 0,
        felt: 892,
        type: 'earthquake'
      },
      {
        id: 'us7000k1a4',
        magnitude: 7.1,
        place: '67 km E of Christchurch, New Zealand',
        time: new Date(Date.now() - 7200000).getTime(),
        coordinates: [172.6, -43.5, 15.0],
        depth: 15.0,
        significance: 986,
        alert: 'orange',
        tsunami: 1,
        felt: 2340,
        type: 'earthquake'
      },
      {
        id: 'us7000k1a5',
        magnitude: 5.4,
        place: '89 km NW of Istanbul, Turkey',
        time: new Date(Date.now() - 10800000).getTime(),
        coordinates: [28.0, 41.2, 12.8],
        depth: 12.8,
        significance: 456,
        alert: 'yellow',
        tsunami: 0,
        felt: 1567,
        type: 'earthquake'
      },
      {
        id: 'us7000k1a6',
        magnitude: 3.2,
        place: '12 km N of San Francisco, California',
        time: new Date(Date.now() - 14400000).getTime(),
        coordinates: [-122.4, 37.8, 5.2],
        depth: 5.2,
        significance: 123,
        alert: 'green',
        tsunami: 0,
        felt: 245,
        type: 'earthquake'
      }
    ];

    setEarthquakeData(mockEarthquakeData);
    setLoading(false);
  }, []);

  const getAlertColor = (alert) => {
    switch (alert) {
      case 'red': return 'bg-red-900 text-red-300 border-red-700';
      case 'orange': return 'bg-orange-900 text-orange-300 border-orange-700';
      case 'yellow': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'green': return 'bg-green-900 text-green-300 border-green-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 7.0) return 'text-red-400';
    if (magnitude >= 6.0) return 'text-orange-400';
    if (magnitude >= 5.0) return 'text-yellow-400';
    if (magnitude >= 4.0) return 'text-blue-400';
    return 'text-green-400';
  };

  const getMagnitudeIcon = (magnitude) => {
    if (magnitude >= 7.0) return '🔴';
    if (magnitude >= 6.0) return '🟠';
    if (magnitude >= 5.0) return '🟡';
    if (magnitude >= 4.0) return '🔵';
    return '🟢';
  };

  const filteredData = selectedMagnitude === 'all' 
    ? earthquakeData 
    : earthquakeData.filter(eq => {
        const mag = eq.magnitude;
        switch (selectedMagnitude) {
          case 'major': return mag >= 7.0;
          case 'strong': return mag >= 6.0 && mag < 7.0;
          case 'moderate': return mag >= 5.0 && mag < 6.0;
          case 'light': return mag >= 4.0 && mag < 5.0;
          case 'minor': return mag < 4.0;
          default: return true;
        }
      });

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading earthquake data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiActivity className="w-6 h-6 text-red-400" />
          Global Earthquake Monitor
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedMagnitude}
            onChange={(e) => setSelectedMagnitude(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
          >
            <option value="all">All Magnitudes</option>
            <option value="major">Major (7.0+)</option>
            <option value="strong">Strong (6.0-6.9)</option>
            <option value="moderate">Moderate (5.0-5.9)</option>
            <option value="light">Light (4.0-4.9)</option>
            <option value="minor">Minor (&lt;4.0)</option>
          </select>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm">Live USGS Data</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
          <FiAlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Major Quakes</h5>
          <p className="text-red-400 text-2xl font-bold">
            {earthquakeData.filter(eq => eq.magnitude >= 7.0).length}
          </p>
          <p className="text-gray-400 text-sm">M7.0+ today</p>
        </div>
        
        <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 text-center">
          <FiActivity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Strong Quakes</h5>
          <p className="text-orange-400 text-2xl font-bold">
            {earthquakeData.filter(eq => eq.magnitude >= 6.0 && eq.magnitude < 7.0).length}
          </p>
          <p className="text-gray-400 text-sm">M6.0-6.9 today</p>
        </div>
        
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-center">
          <FiGlobe className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h5 className="text-white font-semibold">Total Events</h5>
          <p className="text-yellow-400 text-2xl font-bold">{earthquakeData.length}</p>
          <p className="text-gray-400 text-sm">Last 24 hours</p>
        </div>
        
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🌊</div>
          <h5 className="text-white font-semibold">Tsunami Risk</h5>
          <p className="text-blue-400 text-2xl font-bold">
            {earthquakeData.filter(eq => eq.tsunami === 1).length}
          </p>
          <p className="text-gray-400 text-sm">Alerts active</p>
        </div>
      </div>

      {/* Recent Earthquakes List */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4">Recent Earthquake Activity</h4>
        <div className="space-y-4">
          {filteredData.map((earthquake) => (
            <div key={earthquake.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMagnitudeIcon(earthquake.magnitude)}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-2xl font-bold ${getMagnitudeColor(earthquake.magnitude)}`}>
                        M{earthquake.magnitude.toFixed(1)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getAlertColor(earthquake.alert)}`}>
                        {earthquake.alert.toUpperCase()}
                      </span>
                      {earthquake.tsunami === 1 && (
                        <span className="px-2 py-1 bg-blue-900 text-blue-300 border border-blue-700 rounded-full text-xs font-semibold">
                          🌊 TSUNAMI
                        </span>
                      )}
                    </div>
                    <h5 className="text-white font-semibold">{earthquake.place}</h5>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">
                    {new Date(earthquake.time).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {Math.round((Date.now() - earthquake.time) / 60000)} minutes ago
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Depth</p>
                  <p className="text-white font-semibold">{earthquake.depth.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-gray-400">Felt Reports</p>
                  <p className="text-white font-semibold">{earthquake.felt.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Significance</p>
                  <p className="text-white font-semibold">{earthquake.significance}</p>
                </div>
                <div>
                  <p className="text-gray-400">Coordinates</p>
                  <p className="text-white font-semibold">
                    {earthquake.coordinates[1].toFixed(2)}°, {earthquake.coordinates[0].toFixed(2)}°
                  </p>
                </div>
              </div>

              {earthquake.magnitude >= 6.0 && (
                <div className="mt-3 p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    ⚠️ <strong>Significant Earthquake:</strong> This event may have caused damage in populated areas. 
                    Emergency services have been notified.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Global Seismic Activity Map Info */}
      <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <FiMapPin className="w-5 h-5 text-cyan-400" />
          Seismic Activity Regions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-2">🌋 Ring of Fire</h5>
            <p className="text-gray-400 text-sm">
              Pacific Ocean rim showing increased activity. {earthquakeData.filter(eq => 
                (eq.coordinates[0] >= -180 && eq.coordinates[0] <= -120) || 
                (eq.coordinates[0] >= 120 && eq.coordinates[0] <= 180)
              ).length} events detected.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-2">🏔️ Mediterranean</h5>
            <p className="text-gray-400 text-sm">
              Active tectonic zone with moderate seismic activity. Monitoring fault systems
              across Turkey, Greece, and Italy.
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-2">🌍 Mid-Atlantic Ridge</h5>
            <p className="text-gray-400 text-sm">
              Oceanic spreading center with continuous low-level activity. 
              Typical for divergent plate boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeMonitor;
