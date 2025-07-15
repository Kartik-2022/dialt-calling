// src/components/PopulationMap.jsx
import React, { useState, useCallback } from 'react';
import GoogleMapReact from 'google-map-react';
import toast from 'react-hot-toast'; 
import { GOOGLE_MAPS_API_KEY } from '../config';

import { CITIES_DATA } from '../config';

const MapMarker = ({ text, city, onMouseEnter, onMouseLeave, onChildClick }) => (
    <div
      className="relative w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md cursor-pointer flex items-center justify-center text-white font-bold text-xs"
      title={city.name}
      onMouseEnter={() => onMouseEnter(city)} 
      onMouseLeave={onMouseLeave} 
      onClick={() => onChildClick(city)} 
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      📍
    </div>
  );

// Component for a custom Circle overlay
const MapCircle = ({ lat, lng, radiusInPixels, onMouseEnter, onMouseLeave, onChildClick, city }) => {
    const diameter = radiusInPixels * 2; 
  
    return (
      <div
        className="absolute bg-red-500 rounded-full opacity-35 border-2 border-red-700 cursor-pointer"
        style={{
          width: `${diameter}px`,
          height: `${diameter}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 50, 
        }}
        onMouseEnter={() => onMouseEnter(city)}
        onMouseLeave={onMouseLeave} 
        onClick={() => onChildClick(city)} 
        title={`Population influence for ${city.name}`}
      ></div>
    );
  };

const getCircleRadius = (population) => {
 
  const basePixelRadius = Math.sqrt(population) *0.01 ; 

  const minVisiblePixelRadius = 35; 
  
  return Math.max(basePixelRadius, minVisiblePixelRadius);
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

  const handleMouseEnterCity = useCallback((city) => {
    setInfoWindowData({ city: city });
  }, []);


  const handleMouseLeaveCity = useCallback(() => {
    setInfoWindowData(null);
  }, []);

   const handleChildClickZoom = useCallback((city) => {
    setMapCenter({ lat: city.lat, lng: city.lng });
    setMapZoom(9); 
    toast.info(`Zoomed to ${city.name}`); 
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
                onMouseEnter={handleMouseEnterCity}
                onMouseLeave={handleMouseLeaveCity}
                onChildClick={handleChildClickZoom}

              />,
              <MapCircle
                key={`circle-${city.id}`}
                lat={city.lat}
                lng={city.lng}
                radiusInPixels={getCircleRadius(city.population)} 
                zoom={mapZoom}
                city={city}
                onMouseEnter={handleMouseEnterCity}
                onMouseLeave={handleMouseLeaveCity}
                onChildClick={handleChildClickZoom}
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
              
              {infoWindowData.city.malePopulation && infoWindowData.city.femalePopulation && (
                <>
                  <p className="text-gray-700">Male: {infoWindowData.city.malePopulation.toLocaleString()}</p>
                  <p className="text-gray-700">Female: {infoWindowData.city.femalePopulation.toLocaleString()}</p>
                  <p className="text-gray-700">
                    Ratio (M:F): {(infoWindowData.city.malePopulation / infoWindowData.city.femalePopulation).toFixed(2)}:1
                  </p>
                </>
              )}
            </div>
          )}
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default PopulationMap;
