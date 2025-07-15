// src/components/PopulationMap.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Map, Circle, InfoWindow } from '@vis.gl/react-google-maps'; 
import { AdvancedMarker, Pin } from '@vis.gl/react-google-maps/advanced-markers';
import toast from 'react-hot-toast';
import { CITIES_DATA } from '../config';



const getCircleRadius = (population) => {
  const baseRadius = 50000;
  const minPopulation = 10000000;
  const scaleFactor = Math.log10(population) - Math.log10(minPopulation) + 1;
  return baseRadius * scaleFactor * 0.5;
};

const VigPopulationMap = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 22.0, lng: 78.0 });
  const [mapZoom, setMapZoom] = useState(5);
  const [infoWindowData, setInfoWindowData] = useState(null);

  const onMapClick = useCallback(() => {
    setInfoWindowData(null);
    setMapZoom(5);
    setMapCenter({ lat: 22.0, lng: 78.0 });
  }, []);

  const onCityElementClick = useCallback((city) => {
    setMapCenter({ lat: city.lat, lng: city.lng });
    setMapZoom(9);
    setInfoWindowData({ position: { lat: city.lat, lng: city.lng }, city: city });
    toast.info(`Clicked on ${city.name}`);
  }, []);


  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <Map
        center={mapCenter}
        zoom={mapZoom}
        mapId={"population-map-id"}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        onClick={onMapClick}
      >
        {CITIES_DATA.map((city) => (
          <React.Fragment key={city.id}>
            <AdvancedMarker
              position={{ lat: city.lat, lng: city.lng }}
              onClick={() => onCityElementClick(city)}
            >
              <Pin
                background={'#4CAF50'}
                borderColor={'#388E3C'}
                glyphColor={'#FFFFFF'}
              />
            </AdvancedMarker>

            <Circle
              center={{ lat: city.lat, lng: city.lng }}
              radius={getCircleRadius(city.population)}
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                clickable: true,
              }}
              onClick={() => onCityElementClick(city)}
            />
          </React.Fragment>
        ))}

        {infoWindowData && (
          <InfoWindow
            position={infoWindowData.position}
            onCloseClick={() => setInfoWindowData(null)}
          >
            <div className="p-2">
              <h4 className="font-bold text-lg">{infoWindowData.city.name}</h4>
              <p>Population: {infoWindowData.city.population.toLocaleString()}</p>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};

export default VigPopulationMap;
