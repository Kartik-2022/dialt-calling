// src/components/PopulationMap.jsx
import React, { useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import toast from 'react-hot-toast'; 
import { GOOGLE_MAPS_API_KEY } from '../config';
import { CITIES_DATA } from '../config';

// Component for a custom Marker
const MapMarker = ({ text, city, onClick }) => (
  <div
    className="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md cursor-pointer flex items-center justify-center text-white font-bold text-xs"
    title={city.name}
    onClick={() => onClick(city)}
    style={{ transform: 'translate(-50%, -50%)' }}
  >
    📍
  </div>
);

// Component for a custom Circle overlay
const MapCircle = ({ lat, lng, radiusInMeters, zoom, onClick, city }) => {
  const pixelsPerMeter = 2 ** (zoom - 10);
  const size = radiusInMeters * pixelsPerMeter / 1000;

  return (
    <div
      className="absolute bg-red-500 rounded-full opacity-35 border-2 border-red-700 cursor-pointer"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={() => onClick(city)}
      title={`Population influence for ${city.name}`}
    ></div>
  );
};

// Function to calculate circle radius based on population
const getCircleRadius = (population) => {
  const minPop = 10000000;
  const maxPop = 30000000;
  const minRadius = 50000;
  const maxRadius = 150000;

  if (population <= minPop) return minRadius;
  if (population >= maxPop) return maxRadius;

  return minRadius + ((population - minPop) / (maxPop - minPop)) * (maxRadius - minRadius);
};


const PopulationMap = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 22.0, lng: 78.0 });
  const [mapZoom, setMapZoom] = useState(5);
  const [infoWindowData, setInfoWindowData] = useState(null);

  


  const onMapClick = useCallback(({ event }) => {
    setInfoWindowData(null);
    setMapZoom(5);
    setMapCenter({ lat: 22.0, lng: 78.0 });
  }, []);

  const onCityElementClick = useCallback((city) => {
    setMapCenter({ lat: city.lat, lng: city.lng });
    setMapZoom(9);
    setInfoWindowData({ city: city });
   
  }, []);

 

  const onZoomChange = useCallback((newZoom) => {
    setMapZoom(newZoom);
  }, []);


  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200 flex flex-col">
      <div style={{ flexGrow: 1, height: '100%' }}>
        <GoogleMapReact
         bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          center={mapCenter}
          zoom={mapZoom}
          onClick={onMapClick}
          onChildClick={(key, childProps) => onCityElementClick(childProps.city)}
          onZoomChange={onZoomChange}
          yesIWantToUseGoogleMapApiInternals
        >
          {CITIES_DATA.map((city) => (
            [
              <MapMarker
                key={`marker-${city.id}`}
                lat={city.lat}
                lng={city.lng}
                city={city}
                onClick={onCityElementClick}
              />,
              <MapCircle
                key={`circle-${city.id}`}
                lat={city.lat}
                lng={city.lng}
                radiusInMeters={getCircleRadius(city.population)}
                zoom={mapZoom}
                onClick={onCityElementClick}
                city={city}
              />
            ]
          ))}

          {infoWindowData && (
            <div
              key="info-window"
              className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -100%)',
                minWidth: '150px',
                zIndex: 100
              }}
              lat={infoWindowData.city.lat}
              lng={infoWindowData.city.lng}
            >
              <h4 className="font-bold text-lg mb-1">{infoWindowData.city.name}</h4>
              <p className="text-gray-700">Population: {infoWindowData.city.population.toLocaleString()}</p>
              <button
                onClick={() => setInfoWindowData(null)}
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-sm font-bold"
              >
                &times;
              </button>
            </div>
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default PopulationMap;
