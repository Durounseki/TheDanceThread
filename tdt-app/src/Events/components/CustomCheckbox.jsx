import PropTypes from "prop-types";

const CustomCheckbox = ({ style, onCheck }) => {
  return (
    <>
      <label htmlFor={style.value}>
        <input
          className="style-checkbox"
          type="checkbox"
          id={style.id}
          name="style[]"
          value={style.value}
          onChange={onCheck}
          checked={style.checked}
        />
        <div className="custom-checkbox"></div>
        {style.text}
      </label>
    </>
  );
};

CustomCheckbox.propTypes = {
  style: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
  }).isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default CustomCheckbox;
