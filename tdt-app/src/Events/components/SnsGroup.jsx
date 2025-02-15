import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function SnsGroup({
  canRemove,
  onRemove,
  platform,
  setPlatform,
  disabledOptions,
  url,
  setUrl,
  required = true,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const options = [
    {
      value: "website",
      text: "Website",
      faClass: "fa-solid fa-globe",
    },
    {
      value: "facebook",
      text: "Facebook",
      faClass: "fa-brands fa-facebook",
    },
    {
      value: "instagram",
      text: "Instagram",
      faClass: "fa-brands fa-instagram",
    },
    {
      value: "youtube",
      text: "Youtube",
      faClass: "fa-brands fa-youtube",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="sns-group">
      <select
        name="sns-platform[]"
        value={platform}
        onChange={(event) => setPlatform(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={disabledOptions.includes(option.value)}
          >
            {option.text}
          </option>
        ))}
      </select>
      <input
        type="url"
        name="sns-url[]"
        placeholder="Enter URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required={required}
      />
      <button
        type="button"
        onClick={onRemove}
        className={`remove-sns` + (canRemove ? "" : " disabled")}
      >
        {isMobile ? <i className="fa-solid fa-circle-xmark"></i> : "Remove"}
      </button>
    </div>
  );
}

SnsGroup.propTypes = {
  canRemove: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  platform: PropTypes.string,
  setPlatform: PropTypes.func.isRequired,
  disabledOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SnsGroup;
