import PropTypes from "prop-types";

const AutocompleteInput = ({
  options,
  onSelect,
  placeholder,
  label,
  inputName,
  value,
}) => {
  const handleOptions = (event) => {
    const inputValue = event.target.value;
    onSelect(inputValue);
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
      {label && <label htmlFor={label.toLowerCase()}>{label}:</label>}
      <input
        type="text"
        name={inputName.toLowerCase()}
        id={inputName.toLowerCase()}
        value={value && value.name ? value.name : value}
        onInput={handleOptions}
        list={`${inputName.toLowerCase()}-list`}
        placeholder={placeholder}
        autoComplete="off"
      />
      <datalist id={`${inputName.toLowerCase()}-list`}>
        {options.map((option) => (
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
  label: PropTypes.string,
  inputName: PropTypes.string,
};

export default AutocompleteInput;
