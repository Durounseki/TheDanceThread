import { useState, useEffect } from "react";
import { Country } from "country-state-city";
import { v4 as uuidv4 } from "uuid";
import AutocompleteInput from "./AutocompleteInput";
import PropTypes from "prop-types";

const CountrySelect = ({ onSelect }) => {
  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const getCountries = () => {
      const countries = Country.getAllCountries();
      setCountryOptions(
        countries.map((country) => ({
          id: uuidv4(),
          name: country.name,
          code: country.isoCode,
        }))
      );
    };
    getCountries();
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
  };
  return (
    <AutocompleteInput
      options={countryOptions}
      onSelect={handleSelect}
      placeholder={"Select a country"}
      label={"Country"}
    />
  );
};

CountrySelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default CountrySelect;
