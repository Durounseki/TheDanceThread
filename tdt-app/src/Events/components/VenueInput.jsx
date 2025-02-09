import CountrySelect from "./CountrySelect";
import CitySelect from "./CitySelect";

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
