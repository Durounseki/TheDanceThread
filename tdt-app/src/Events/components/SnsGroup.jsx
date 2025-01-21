// import { useState } from "react";
// import PropTypes from "prop-types";

// function SnsGroup({ canRemove, onRemove }) {
//   const [platform, setPlatform] = useState("website");
//   const [url, setUrl] = useState("");

//   return (
//     <div className="sns-group">
//       <select
//         name="sns-platform"
//         value={platform}
//         onChange={(event) => setPlatform(event.target.value)}
//       >
//         <option value="website">Website</option>
//         <option value="facebook">Facebook</option>
//         <option value="instagram">Instagram</option>
//         <option value="youtube">YouTube</option>
//       </select>
//       <input
//         type="text"
//         name="sns-url"
//         placeholder="Enter URL"
//         value={url}
//         onChange={(event) => setUrl(event.target.value)}
//         required
//       />
//       <button
//         type="button"
//         onClick={onRemove}
//         className={`remove-sns` + (canRemove ? "" : " disabled")}
//       >
//         Remove
//       </button>
//     </div>
//   );
// }

// SnsGroup.propTypes = {
//   canRemove: PropTypes.bool.isRequired,
//   onRemove: PropTypes.func.isRequired,
// };

// export default SnsGroup;

import { useState } from "react";
import PropTypes from "prop-types";

function SnsGroup({
  canRemove,
  onRemove,
  platform,
  setPlatform,
  disabledOptions,
}) {
  const options = [
    {
      value: "website",
      text: "Website",
    },
    {
      value: "facebook",
      text: "Facebook",
    },
    {
      value: "instagram",
      text: "Instagram",
    },
    {
      value: "youtube",
      text: "Youtube",
    },
  ];
  const [url, setUrl] = useState("");

  return (
    <div className="sns-group">
      <select
        name="sns-platform"
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
        type="text"
        name="sns-url"
        placeholder="Enter URL"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />
      <button
        type="button"
        onClick={onRemove}
        className={`remove-sns` + (canRemove ? "" : " disabled")}
      >
        Remove
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
