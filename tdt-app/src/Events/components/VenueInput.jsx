import CountrySelect from "./CountrySelect";
import CitySelect from "./CitySelect";
import { useEffect, useState } from "react";
import { useCountries, useCities } from "../../otherQueries";

const VenueInput = ({
  country,
  setCountry,
  city,
  setCity,
  venueName,
  setVenueName,
  venueUrl,
  setVenueUrl,
}) => {
  const { data: countryOptions } = useCountries();
  const { data: cityOptions } = useCities(country ? country.code : null, {
    enabled: !!country,
  });
  useEffect(() => {
    if (
      countryOptions &&
      countryOptions.length > 0 &&
      country &&
      typeof country === "string"
    ) {
      setCountry(
        countryOptions.find(
          (option) => option.name.toLowerCase() === country.toLowerCase()
        )
      );
    }
    if (
      cityOptions &&
      cityOptions.length > 0 &&
      city &&
      typeof city === "string"
    ) {
      setCity(
        cityOptions.find(
          (option) => option.name.toLowerCase() === city.toLowerCase()
        )
      );
    }
  }, [city, cityOptions, country, countryOptions, setCity, setCountry]);
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
      <CountrySelect value={country} onSelect={handleCountrySelect} />
      {country && (
        <CitySelect
          value={city}
          countryCode={country.code}
          onSelect={handleCitySelect}
        />
      )}

      <label htmlFor="venue-name">Venue:</label>
      <input
        type="text"
        id="venue-name"
        name="venue-name[]"
        value={venueName}
        placeholder="Enter the venue name"
        onChange={(e) => setVenueName(e.target.value)}
        required
      />

      <label htmlFor="venue-url">Location:</label>
      <input
        type="url"
        id="venue-url"
        name="venue-url[]"
        placeholder="Google Maps link"
        value={venueUrl}
        onChange={(e) => setVenueUrl(e.target.value)}
        required
      />
    </>
  );
};

export default VenueInput;
