// src/helpers/googleService.js

import { isGoogleMapsPlacesReady } from '../utils/googleMapsLoader';

let sessionToken = null;

export const startNewAutocompleteSession = () => {
  if (isGoogleMapsPlacesReady()) {
    sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    console.log('Autocomplete Session Token created.');
  } else {
    sessionToken = null;
  }
};


export const clearAutocompleteSession = () => {
  sessionToken = null;
  console.log('Autocomplete Token cleared.');
};

export const googlePlaceSearch = (searchValue) => {
  return new Promise((resolve, reject) => {
    if (!isGoogleMapsPlacesReady() || !searchValue) {
      return resolve([]);
    }

    if (!sessionToken) {
      startNewAutocompleteSession(); 
    }

    const googleService = new window.google.maps.places.AutocompleteService();
    googleService.getPlacePredictions(
      {
        input: searchValue,
        componentRestrictions: {
          country: "in", 
        },
        sessionToken: sessionToken, 
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          const searchedPlaces = [];
          predictions?.forEach((prediction) => {
            searchedPlaces?.push(prediction);
          });
          resolve(searchedPlaces);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          resolve([]);
        } else {
          console.error("Google Place Search Error:", status);
          reject(new Error(`Google Place Search failed with status: ${status}`));
        }
      }
    );
  });
};


export const googlePlaceDetails = (placeId) => {
  return new Promise((resolve, reject) => {
    if (!isGoogleMapsPlacesReady() || !placeId) {
      return resolve({});
    }


    if (!sessionToken) {
      startNewAutocompleteSession(); 
    }

    const placesService = new window.google.maps.Geocoder();
    placesService.geocode(
      {
        placeId,
        sessionToken: sessionToken, 
      },
      (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results && results.length > 0) {
          resolve(_formatAddress(results)); 
        } else if (status === window.google.maps.GeocoderStatus.ZERO_RESULTS) {
          resolve({});
        } else {
          console.error("Google Place Details Error:", status);
          reject(new Error(`Google Place Details failed with status: ${status}`));
        }
      }
    );
  });
};


export const _formatAddress = (result) => {
  if (!result || result.length === 0 || !result[0]) return {};

  const addressComponents = {};

  result[0].address_components.forEach((component) => {
    component.types.forEach((type) => {
      if (!(addressComponents[type] && addressComponents[type]?.length)) {
        addressComponents[type] = [];
      }
      addressComponents[type].push(component.long_name);
    });
  });

  let sublocalities = "";
  if (addressComponents.sublocality && addressComponents.sublocality.length) {
    addressComponents.sublocality.forEach((sublocality) => {
      sublocalities += sublocality + " ";
    });
  }

  return {
    address:
      (addressComponents.street_number?.length
        ? addressComponents.street_number[0]
        : "") +
      (addressComponents.route?.length
        ? ` ${addressComponents.route[0]}`
        : "") +
      `${sublocalities?.trim().length ? ` ${sublocalities.trim()}` : ""}`,
    county:
      addressComponents.administrative_area_level_2 &&
      addressComponents.administrative_area_level_2.length
        ? addressComponents.administrative_area_level_2[0]
        : "",
    city:
      addressComponents.locality && addressComponents.locality.length
        ? addressComponents.locality[0]
        : addressComponents.administrative_area_level_2 &&
          addressComponents.administrative_area_level_2.length
        ? addressComponents.administrative_area_level_2[0]
        : "",
    state:
      addressComponents.administrative_area_level_1 &&
      addressComponents.administrative_area_level_1.length
        ? addressComponents.administrative_area_level_1[0]
        : "",
    country:
      addressComponents.country && addressComponents.country.length
        ? addressComponents.country[0]
        : "",
    postal:
      addressComponents.postal_code && addressComponents.postal_code.length
        ? addressComponents.postal_code[0]
        : "",
    lat: result?.[0]?.geometry?.location?.lat(),
    lng: result?.[0]?.geometry?.location?.lng(),
  };
};
