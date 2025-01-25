import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SnsGroup from "./SnsGroup";
import { v4 as uuidv4 } from "uuid";
import CustomCheckbox from "./CustomCheckbox";
import VenueInput from "./VenueInput";

function EventForm() {
  const navigate = useNavigate();
  const [styleOptions, setStyleOptions] = useState([
    {
      id: uuidv4(),
      value: "salsa",
      text: "Salsa",
      checked: false,
    },
    {
      id: uuidv4(),
      value: "bachata",
      text: "Bachata",
      checked: false,
    },
    {
      id: uuidv4(),
      value: "kizomba",
      text: "Kizomba",
      checked: false,
    },
    {
      id: uuidv4(),
      value: "zouk",
      text: "Zouk",
      checked: false,
    },
  ]);
  const [otherStyle, setOtherStyle] = useState("");
  const [snsGroups, setSnsGroups] = useState([
    { id: uuidv4(), platform: "website" },
  ]);
  const textAreaRef = useRef(null);
  const dateRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const textArea = textAreaRef.current;
    const resizeTextArea = () => {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    };
    textArea.addEventListener("input", resizeTextArea);

    resizeTextArea();
    return () => textArea.removeEventListener("input", resizeTextArea);
  }, []);

  useEffect(() => {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    today.setFullYear(today.getFullYear() + 2);
    const maxDate = today.toISOString().split("T")[0];
    if (dateRef.current) {
      dateRef.current.min = minDate;
      dateRef.current.max = maxDate;
    }
  }, []);

  const handleStyleCheck = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      setStyleOptions(
        styleOptions.map((option) =>
          option.id === id ? { ...option, checked: true } : option
        )
      );
    } else {
      setStyleOptions(
        styleOptions.map((option) =>
          option.id === id ? { ...option, checked: false } : option
        )
      );
    }
  };

  const handleOtherStyle = (event) => {
    event.preventDefault;
    const value = otherStyle.trim().toLowerCase();
    if (!styleOptions.some((style) => style.value === value)) {
      const newStyle = {
        id: uuidv4(),
        value: value,
        text: value.charAt(0).toUpperCase() + value.slice(1),
        checked: true,
      };
      setStyleOptions([...styleOptions, newStyle]);
    }
    setOtherStyle("");
  };

  const handleAddSnsLink = () => {
    if (snsGroups.length < 4) {
      const platforms = ["website", "facebook", "instagram", "youtube"];
      setSnsGroups([
        ...snsGroups,
        {
          id: uuidv4(),
          platform: platforms.filter(
            (platform) =>
              !snsGroups.map((group) => group.platform).includes(platform)
          )[0],
        },
      ]);
    }
  };

  const handleRemoveSnsLink = (groupId) => {
    if (snsGroups.length > 1) {
      setSnsGroups(snsGroups.filter((group) => group.id !== groupId));
    }
  };

  const handleSnsPlatformChange = (groupId, newPlatform) => {
    setSnsGroups((prevSnsGroups) =>
      prevSnsGroups.map((group) =>
        group.id === groupId ? { ...group, platform: newPlatform } : group
      )
    );
  };

  const getDisabledOptions = (groupId) => {
    const disabledOptions = [];
    snsGroups.forEach((group) => {
      if (group.id !== groupId) {
        disabledOptions.push(group.platform);
      }
    });
    return disabledOptions;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      for (const key of formData.keys()) {
        console.log(key + ": " + formData.get(key));
      }
      const response = await fetch(`${apiUrl}/events`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        navigate("/events");
      } else {
        console.error("Error creating event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="event-form-container">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-event-form"
      >
        <label htmlFor="name">Event Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="The Dance Thread"
        />
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" name="date" required ref={dateRef} />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Dance, share, celebrate yourself!"
          ref={textAreaRef}
        ></textarea>

        <div className="form-separator"></div>
        <h3 className="form-section-header">Dance Styles</h3>

        <div className="form-checkbox-container">
          {styleOptions.map((style) => (
            <CustomCheckbox
              key={style.id}
              style={style}
              onCheck={handleStyleCheck}
            />
          ))}
        </div>

        <label htmlFor="other">Other</label>
        <div className="other-style-container">
          <input
            type="text"
            id="other"
            name="other-style"
            value={otherStyle}
            onChange={(event) => setOtherStyle(event.target.value)}
          />
          <button
            type="button"
            id="user-add-style"
            className="event-form-button"
            onClick={handleOtherStyle}
          >
            Add Style
          </button>
        </div>

        <div className="form-separator"></div>
        <VenueInput />

        <div className="form-separator"></div>
        <h3 className="form-section-header">Social Media</h3>

        <div className="sns-container">
          {snsGroups.map((group) => (
            <SnsGroup
              key={group.id}
              onRemove={() => handleRemoveSnsLink(group.id)}
              canRemove={snsGroups.length > 1}
              platform={group.platform}
              setPlatform={(newPlatform) =>
                handleSnsPlatformChange(group.id, newPlatform)
              }
              disabledOptions={getDisabledOptions(group.id)}
            />
          ))}
          {snsGroups.length < 4 && (
            <button
              type="button"
              className="event-form-button"
              id="add-sns"
              onClick={handleAddSnsLink}
            >
              Add Link
            </button>
          )}
        </div>

        <div className="form-separator"></div>
        <h3 className="form-section-header">Flyer</h3>
        <label htmlFor="flyer">Upload Image:</label>
        <input type="file" accept="image/*" id="flyer" name="flyer" />

        <button type="submit" className="event-form-button">
          Add Event
        </button>
      </form>
    </div>
  );
}

export default EventForm;
