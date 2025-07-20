import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { FiZap, FiTrendingUp, FiWind, FiSun, FiDroplet, FiHeart } from 'react-icons/fi';

const EnergyEnvironmentWidget = () => {
  const [energyData, setEnergyData] = useState({});
  const [environmentalData, setEnvironmentalData] = useState({});
  const [selectedView, setSelectedView] = useState('energy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock energy and environmental data
    const mockEnergyData = {
      renewableGeneration: {
        current: 4850, // GW
        growth: 12.3,
        data: [4200, 4350, 4500, 4650, 4750, 4850, 4950],
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      energyMix: {
        labels: ['Solar', 'Wind', 'Hydro', 'Nuclear', 'Natural Gas', 'Coal', 'Oil'],
        data: [18.5, 22.3, 16.8, 10.2, 20.1, 8.9, 3.2],
        colors: ['#f59e0b', '#06b6d4', '#3b82f6', '#8b5cf6', '#6b7280', '#374151', '#1f2937']
      },
      carbonEmissions: {
        current: 36.2, // Gt CO2
        target: 25.0,
        reduction: -3.8,
        data: [42.1, 40.5, 39.2, 37.8, 36.8, 36.2, 35.1],
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024']
      },
      evAdoption: {
        current: 14.2, // Million vehicles
        growth: 28.5,
        marketShare: 18.7
      }
    };

    const mockEnvironmentalData = {
      airQuality: {
        aqi: 87,
        status: 'Moderate',
        trend: 'improving',
        cities: [
          { name: 'Tokyo', aqi: 52, status: 'Good' },
          { name: 'London', aqi: 73, status: 'Moderate' },
          { name: 'New York', aqi: 89, status: 'Moderate' },
          { name: 'Delhi', aqi: 168, status: 'Unhealthy' },
          { name: 'Beijing', aqi: 134, status: 'Unhealthy' }
        ]
      },
      climateIndicators: {
        globalTemp: 1.38, // °C above pre-industrial
        seaLevel: 3.4, // mm/year rise
        arcticIce: -13.2, // % change
        co2Level: 421.5 // ppm
      },
      biodiversity: {
        speciesAtRisk: 41000,
        protectedAreas: 18.7, // % of land
        deforestation: -10.2, // Million hectares/year
        reforestation: 5.6 // Million hectares/year
      },
      sustainability: {
        renewableInvestment: 1.8, // Trillion USD
        circularEconomy: 8.6, // % global materials
        waterStress: 2.4, // Billion people affected
        foodSecurity: 768 // Million undernourished
      }
    };

    setEnergyData(mockEnergyData);
    setEnvironmentalData(mockEnvironmentalData);
    setLoading(false);
  }, []);

  const renewableChartData = energyData.renewableGeneration ? {
    labels: energyData.renewableGeneration.labels,
    datasets: [
      {
        label: 'Renewable Generation (GW)',
        data: energyData.renewableGeneration.data,
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        borderWidth: 2,
      },
    ],
  } : null;

  const emissionsChartData = energyData.carbonEmissions ? {
    labels: energyData.carbonEmissions.labels,
    datasets: [
      {
        label: 'CO2 Emissions (Gt)',
        data: energyData.carbonEmissions.data,
        borderColor: '#ef4444',
        backgroundColor: '#ef444420',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        borderWidth: 2,
      },
      {
        label: 'Target',
        data: Array(energyData.carbonEmissions.labels.length).fill(energyData.carbonEmissions.target),
        borderColor: '#10b981',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
      }
    ],
  } : null;

  const energyMixData = energyData.energyMix ? {
    labels: energyData.energyMix.labels,
    datasets: [
      {
        data: energyData.energyMix.data,
        backgroundColor: energyData.energyMix.colors,
        borderWidth: 0,
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-white">Loading environmental data...</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg shadow-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiHeart className="w-6 h-6 text-green-400" />
          Energy & Environment Intelligence
        </h3>
        <div className="flex bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setSelectedView('energy')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedView === 'energy' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Energy
          </button>
          <button
            onClick={() => setSelectedView('environment')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedView === 'environment' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Environment
          </button>
        </div>
      </div>

      {selectedView === 'energy' ? (
        <>
          {/* Energy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiZap className="w-6 h-6 text-yellow-400" />
                <FiTrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-2xl font-bold">{energyData.renewableGeneration?.current} GW</p>
              <p className="text-gray-400 text-sm">Renewable Generation</p>
              <p className="text-green-400 text-xs">+{energyData.renewableGeneration?.growth}% YoY</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiDroplet className="w-6 h-6 text-red-400" />
                <FiTrendingUp className="w-4 h-4 text-red-400 rotate-180" />
              </div>
              <p className="text-white text-2xl font-bold">{energyData.carbonEmissions?.current} Gt</p>
              <p className="text-gray-400 text-sm">CO2 Emissions</p>
              <p className="text-red-400 text-xs">{energyData.carbonEmissions?.reduction}% YoY</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiZap className="w-6 h-6 text-blue-400" />
                <FiTrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-white text-2xl font-bold">{energyData.evAdoption?.current}M</p>
              <p className="text-gray-400 text-sm">Electric Vehicles</p>
              <p className="text-green-400 text-xs">+{energyData.evAdoption?.growth}% YoY</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiSun className="w-6 h-6 text-orange-400" />
                <span className="text-xs text-gray-400">Market</span>
              </div>
              <p className="text-white text-2xl font-bold">{energyData.evAdoption?.marketShare}%</p>
              <p className="text-gray-400 text-sm">EV Market Share</p>
            </div>
          </div>

          {/* Energy Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Renewable Generation Trend */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Renewable Energy Growth</h4>
              <div className="h-48">
                <Line
                  data={renewableChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      },
                      y: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Carbon Emissions */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Carbon Emissions vs Target</h4>
              <div className="h-48">
                <Line
                  data={emissionsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { 
                        display: true,
                        labels: { color: '#ffffff' }
                      } 
                    },
                    scales: {
                      x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      },
                      y: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: '#1f2937' }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Energy Mix */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Global Energy Mix</h4>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {energyData.energyMix?.labels.map((label, index) => (
                <div key={label} className="text-center">
                  <div 
                    className="w-full h-24 rounded-lg mb-2 flex items-end justify-center text-white font-bold"
                    style={{
                      backgroundColor: energyData.energyMix.colors[index],
                      opacity: 0.8
                    }}
                  >
                    <span className="mb-2">{energyData.energyMix.data[index]}%</span>
                  </div>
                  <p className="text-gray-400 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Environmental Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiWind className="w-6 h-6 text-blue-400" />
                <span className={`text-xs px-2 py-1 rounded ${
                  environmentalData.airQuality?.status === 'Good' ? 'bg-green-900 text-green-300' :
                  environmentalData.airQuality?.status === 'Moderate' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {environmentalData.airQuality?.status}
                </span>
              </div>
              <p className="text-white text-2xl font-bold">{environmentalData.airQuality?.aqi}</p>
              <p className="text-gray-400 text-sm">Global Air Quality Index</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiTrendingUp className="w-6 h-6 text-red-400" />
                <span className="text-xs text-gray-400">°C</span>
              </div>
              <p className="text-white text-2xl font-bold">+{environmentalData.climateIndicators?.globalTemp}</p>
              <p className="text-gray-400 text-sm">Global Temperature Rise</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiDroplet className="w-6 h-6 text-cyan-400" />
                <span className="text-xs text-gray-400">mm/yr</span>
              </div>
              <p className="text-white text-2xl font-bold">{environmentalData.climateIndicators?.seaLevel}</p>
              <p className="text-gray-400 text-sm">Sea Level Rise</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FiHeart className="w-6 h-6 text-green-400" />
                <span className="text-xs text-gray-400">ppm</span>
              </div>
              <p className="text-white text-2xl font-bold">{environmentalData.climateIndicators?.co2Level}</p>
              <p className="text-gray-400 text-sm">Atmospheric CO2</p>
            </div>
          </div>

          {/* Air Quality by City */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
            <h4 className="text-white font-semibold mb-4">Air Quality by Major Cities</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {environmentalData.airQuality?.cities.map((city, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                  <h5 className="text-white font-semibold">{city.name}</h5>
                  <p className="text-2xl font-bold mb-1" style={{
                    color: city.aqi <= 50 ? '#10b981' :
                           city.aqi <= 100 ? '#f59e0b' :
                           city.aqi <= 150 ? '#ef4444' : '#dc2626'
                  }}>
                    {city.aqi}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    city.status === 'Good' ? 'bg-green-900 text-green-300' :
                    city.status === 'Moderate' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {city.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Biodiversity */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Biodiversity & Conservation</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Species at Risk</span>
                  <span className="text-red-400 font-bold">{environmentalData.biodiversity?.speciesAtRisk?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Protected Areas</span>
                  <span className="text-green-400 font-bold">{environmentalData.biodiversity?.protectedAreas}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Deforestation</span>
                  <span className="text-red-400 font-bold">{environmentalData.biodiversity?.deforestation}M ha/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Reforestation</span>
                  <span className="text-green-400 font-bold">+{environmentalData.biodiversity?.reforestation}M ha/yr</span>
                </div>
              </div>
            </div>

            {/* Sustainability Metrics */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-4">Sustainability Indicators</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Renewable Investment</span>
                  <span className="text-green-400 font-bold">${environmentalData.sustainability?.renewableInvestment}T</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Circular Economy</span>
                  <span className="text-blue-400 font-bold">{environmentalData.sustainability?.circularEconomy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Water Stress</span>
                  <span className="text-yellow-400 font-bold">{environmentalData.sustainability?.waterStress}B people</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Food Insecurity</span>
                  <span className="text-red-400 font-bold">{environmentalData.sustainability?.foodSecurity}M people</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnergyEnvironmentWidget;
