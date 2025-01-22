import { useState } from "react";
import PropTypes from "prop-types";

const AutocompleteInput = ({ options, onSelect, placeholder, label }) => {
  const [value, setValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleOptions = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    const newOptions = options.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(newOptions);
    const selected = options.find(
      (option) => option.name.toLowerCase() === inputValue.toLowerCase()
    );
    if (selected) {
      onSelect(selected);
    } else {
      onSelect(null);
    }
  };
  return (
    <>
      <label htmlFor={label.toLowerCase()}>{label}:</label>
      <input
        type="text"
        name={label.toLowerCase()}
        id={label.toLowerCase()}
        value={value}
        onInput={handleOptions}
        list={`${label.toLowerCase()}-list`}
        placeholder={placeholder}
      />
      <datalist id={`${label.toLowerCase()}-list`}>
        {filteredOptions.map((option) => (
          <option key={option.id}>{option.name}</option>
        ))}
      </datalist>
    </>
  );
};

AutocompleteInput.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default AutocompleteInput;
