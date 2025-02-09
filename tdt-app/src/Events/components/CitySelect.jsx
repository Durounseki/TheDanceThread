import { useState, useEffect } from "react";
import { City, State } from "country-state-city";
import { v4 as uuidv4 } from "uuid";
import AutocompleteInput from "./AutocompleteInput";
import PropTypes from "prop-types";

const CitySelect = ({ value, countryCode, onSelect }) => {
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (countryCode) {
      const getCities = () => {
        const cities = City.getCitiesOfCountry(countryCode);
        if (cities) {
          setCityOptions(
            cities.map((city) => ({
              id: uuidv4(),
              name:
                city.name +
                ", " +
                State.getStateByCodeAndCountry(city.stateCode, countryCode)
                  .name,
            }))
          );
        } else {
          setCityOptions([]);
        }
      };
      getCities();
    } else {
      setCityOptions([]);
    }
  }, [countryCode]);

  const handleSelect = (option) => {
    onSelect(option);
  };
  return (
    <AutocompleteInput
      options={cityOptions}
      onSelect={handleSelect}
      placeholder={"Select a city"}
      label={"City"}
      inputName={"city"}
      value={value}
    />
  );
};

CitySelect.propTypes = {
  countryCode: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default CitySelect;
