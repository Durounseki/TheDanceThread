import { useState } from "react";
import CountrySelect from "./CountrySelect";
import CitySelect from "./CitySelect";

const VenueInput = () => {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const handleCountrySelect = (option) => {
    setCountry(option);
    setCity("");
  };

  const handleCitySelect = (option) => {
    setCity(option);
  };
  return (
    <>
      <h3 className="form-section-header">Venue</h3>
      <CountrySelect onSelect={handleCountrySelect} />
      {country && (
        <CitySelect countryCode={country.code} onSelect={handleCitySelect} />
      )}

      <label htmlFor="venue-name">Venue:</label>
      <input type="text" id="venue-name" name="venue-name[]" required />

      <label htmlFor="venue-url">Location:</label>
      <input
        type="url"
        id="venue-url"
        name="venue-url[]"
        placeholder="Google Maps link"
        required
      />
    </>
  );
};

export default VenueInput;
