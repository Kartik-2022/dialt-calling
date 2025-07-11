// src/utils/googleMapsLoader.js
export const isGoogleMapsPlacesReady = () => {
    return window.googleMapsApiLoaded === true &&
           typeof window.google !== 'undefined' &&
           typeof window.google.maps !== 'undefined' &&
           typeof window.google.maps.places !== 'undefined';
  };
  