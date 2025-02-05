import { useState, useEffect } from "react";
import AutocompleteInput from "./AutocompleteInput";
import PropTypes from "prop-types";

const StyleSearch = ({ onSelect }) => {
  const [styleOptions, setStyleOptions] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/styles`);
        const data = await response.json();
        setStyleOptions(data);
      } catch (error) {
        console.error("Failed to fetch styles:", error);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (option) => {
    onSelect(option.name);
  };

  return (
    <AutocompleteInput
      options={styleOptions}
      onSelect={handleSelect}
      placeholder={"Search by dance style"}
      inputName={"style-search"}
      label={"Style"}
    />
  );
};

StyleSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default StyleSearch;
