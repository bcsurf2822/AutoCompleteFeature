import { useRef, useEffect, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { formatStreet } from "./helpers/formatAddress";
import { searchAddress } from "./utils/axios-util";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const PlaceAutocompleteClassic = () => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  // bounds strict now just need to make sure we are only querying the correct area as per the dataset
  const cityLimits = {
    north: 34.342452,
    south: 33.692558,
    east: -117.679592,
    west: -118.682393,
  };

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["address_components", "name", "formatted_address"],
      bounds: cityLimits,
      strictBounds: true,
      types: ["address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const selectedPlace = placeAutocomplete.getPlace();
      const stName = formatStreet(selectedPlace.name);
      let streetNumber = "";
      let postcode = "";

      for (const component of selectedPlace.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
          case "street_number":
            streetNumber = `${component.long_name}${streetNumber}`;
            break;
          case "postal_code":
            postcode = `${component.long_name}${postcode}`;
            break;
          default:
            break;
        }
      }

      const validationAddress = {
        house_number: streetNumber,
        street_name: stName,
        zip_code: postcode,
      };

      console.log("Address Obj", validationAddress);
      // would really like to set up react query here to handle errors and loading states
      searchAddress(validationAddress);
    });
  }, [placeAutocomplete]);

  return (
    <div>
      <input
        className="w-full pl-2 border mb-4  py-2 rounded-lg border-slate-300  focus:outline-slate-400 "
        ref={inputRef}
        placeholder="Enter Your Address"
      />
    </div>
  );
};

const GoogleAutoComplete = () => (
  <APIProvider apiKey={GOOGLE_API_KEY}>
    <PlaceAutocompleteClassic />
  </APIProvider>
);

export default GoogleAutoComplete;
