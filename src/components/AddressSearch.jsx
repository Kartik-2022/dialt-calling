// src/components/AddressSearch.jsx
import React, { useState, useCallback } from "react";
import GoogleMapInput from "./GoogleMapInput";
import toast from 'react-hot-toast';

const AddressSearch = () => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    county: "",
    state: "",
    pinCode: "",
  });

  const [isDirty, setIsDirty] = useState({});
  const [errors, setErrors] = useState({});

  const [inpValue, setInpValue] = useState(""); 

  const _handleChange = useCallback((key, value) => {
    setAddress(prevAddress => ({ ...prevAddress, [key]: value }));
  }, []);

  const _onBlurAddress = (field) => {
    const newIsDirty = { ...isDirty, [field]: true };
    _validateAddress({ newAddress: address, newIsDirty });
  };

  const handleGoogleAddressSelect = useCallback((selectedAddress) => {
    setAddress(selectedAddress);
    setErrors({}); 
    setIsDirty({}); 
  }, []);

  const _validateAddress = useCallback(({ newAddress, newIsDirty }) => {
    let isFormValid = true;
    let newErrors = {};

    Object.keys(newAddress).forEach((key) => {
      if (newIsDirty[key]) {
        switch (key) {
          case "city":
          case "street":
          case "county":
          case "state":
            if (!newAddress[key]?.trim()) {
              newErrors[key] = "*Required";
              isFormValid = false;
            } else {
              newErrors[key] = null;
            }
            break;

          case "pinCode":
            if (!newAddress[key]?.trim()) {
                newErrors[key] = "*Required";
                isFormValid = false;
            } else if (!/^\d{6}$/.test(newAddress[key])) {
                newErrors[key] = "*Invalid Pin Code (6 digits required)";
                isFormValid = false;
            } else {
                newErrors[key] = null;
            }
            break;

          default:
            break;
        }
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, []);

  const _makeAllIsDirty = useCallback(() => {
    const newIsDirty = {};
    Object.keys(address).forEach((key) => {
      newIsDirty[key] = true;
    });
    return newIsDirty;
  }, [address]);

  const _handleSubmit = async (e) => {
    e.preventDefault();
    const allDirty = _makeAllIsDirty();
    setIsDirty(allDirty);

    const isValid = _validateAddress({ newAddress: address, newIsDirty: allDirty });

    if (isValid) {
      console.log("Submitted address payload:", address);
      toast.success("Address submitted successfully! Check console for payload.");
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  const resetAddress = useCallback(() => {
    setAddress({
      street: "",
      city: "",
      county: "",
      state: "",
      pinCode: "",
    });
    setErrors({});
    setIsDirty({});
    setInpValue(""); 
  }, []);

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Address Search Form</h3>

      <div className="mb-4">
        <label htmlFor="google-address-search" className="block text-gray-700 text-sm font-bold mb-2">
          Search Address
        </label>
        <GoogleMapInput
          id="google-address-search"
          onChange={handleGoogleAddressSelect}

          value={address} 
          placeholder="Search for an address..."
        />
      </div>

      <form onSubmit={_handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            placeholder="Street Address"
            onChange={(e) => _handleChange("street", e.target.value)}
            onBlur={() => _onBlurAddress("street")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.street && <p className="text-red-500 text-xs italic mt-1">{errors.street}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            placeholder="City"
            onChange={(e) => _handleChange("city", e.target.value)}
            onBlur={() => _onBlurAddress("city")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.city && <p className="text-red-500 text-xs italic mt-1">{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="county" className="block text-gray-700 text-sm font-bold mb-2">
            County
          </label>
          <input
            type="text"
            id="county"
            name="county"
            value={address.county}
            placeholder="County"
            onChange={(e) => _handleChange("county", e.target.value)}
            onBlur={() => _onBlurAddress("county")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.county && <p className="text-red-500 text-xs italic mt-1">{errors.county}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={address.state}
            placeholder="State"
            onChange={(e) => _handleChange("state", e.target.value)}
            onBlur={() => _onBlurAddress("state")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {errors.state && <p className="text-red-500 text-xs italic mt-1">{errors.state}</p>}
        </div>

        <div>
          <label htmlFor="pinCode" className="block text-gray-700 text-sm font-bold mb-2">
            Pin Code
          </label>
          <input
            type="text"
            id="pinCode"
            name="pinCode"
            value={address.pinCode}
            placeholder="Pin Code (Auto-filled)"
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed"
          />
          {errors.pinCode && <p className="text-red-500 text-xs italic mt-1">{errors.pinCode}</p>}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={resetAddress}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressSearch;
