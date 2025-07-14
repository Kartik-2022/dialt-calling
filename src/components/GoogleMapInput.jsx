// src/components/GoogleMapInput.jsx
import React, { useEffect, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { googlePlaceDetails, googlePlaceSearch } from "../api/googlePlaces";
import toast from 'react-hot-toast';


const GoogleMapInput = ({ onChange, disabled = false, value, placeholder }) => {
  const searchInputTimerRef = useRef(null);
  const [inputValue, setInputValue] = useState(null);

  const _loadOptions = (searchInput, callback) => {

    if (!searchInput) {
      return callback([]);
    }

    searchInputTimerRef.current = setTimeout(async () => {
      try {
        const result = await googlePlaceSearch(searchInput);

        if (!result?.length) return callback([]);

        const formatResult = result.map((each) => ({
          ...each,
          label: each.description,
          value: each.place_id,
        }));

        callback(formatResult);
      } catch (error) {
        console.error("Error", error);
       errorHandler({message: "Failed to fetch address suggestions. Please try again."});
        callback([]);
      }
    }, 500); 
  };

  const _handleSelectChange = async (selectedOption) => {
    setInputValue(selectedOption);
    if (!onChange) return;

    if (!selectedOption) {
      onChange({
        street: "",
        city: "",
        county: "",
        state: "",
        pinCode: "",
      });
      return;
    }

    try {
      setInputValue(null);
      // used to fetch the details of the selected place
      const detail = await googlePlaceDetails(selectedOption?.place_id);
      
      // postal code is mandatory for address validation - otherwise show error
      if (!detail?.postal) {
        errorHandler({message: "Selected address is invalid (missing pincode). Please choose another."});
        onChange({
          street: "",
          city: "",
          county: "",
          state: "",
          pinCode: "",
        });
        return;
      }
      const address = {};

      address["street"] = detail?.address || "";
      address["city"] = detail?.city || "";
      address["county"] = detail?.county || "";
      address["state"] = detail?.state || ""; 
      address["pinCode"] = detail?.postal || "";
      address["lat"] = detail?.lat || "";
      address["lng"] = detail?.lng || "";

      onChange(address);
    } catch (error) {
      console.error("Error fetching Google Place Details:", error);
     errorHandler({message:"Failed to get address details. Please try again."});
      setInputValue(null);
      // onChange({
      //   street: "",
      //   city: "",
      //   county: "",
      //   state: "",
      //   pinCode: "",
      // });
    }
  };

  useEffect(() => {
    if (!value || (value.street === "" && value.city === "" && value.pinCode === "")) {
      setInputValue(null);
    }
  }, [value]);

  return (
    <AsyncSelect
      placeholder={placeholder || "Search Address"}
      cacheOptions
      // defaultOptions
      loadOptions={_loadOptions}
      value={inputValue}
      onChange={_handleSelectChange}
      isDisabled={disabled}
      isClearable
      classNamePrefix="react-select"
      styles={{
        control: (provided) => ({
          ...provided,
          borderRadius: '0.375rem',
          borderColor: '#d1d5db',
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#9ca3af',
          },
          minHeight: '38px',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#6b7280',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#1f2937',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? '#e0e7ff' : 'white',
          color: '#1f2937',
          '&:active': {
            backgroundColor: '#c7d2fe',
          },
        }),
      }}
    />
  );
};

export default GoogleMapInput;
