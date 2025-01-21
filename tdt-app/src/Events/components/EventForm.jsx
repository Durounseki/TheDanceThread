import { useState, useRef, useEffect } from "react";
import SnsGroup from "./SnsGroup";
import { v4 as uuidv4 } from "uuid";

function EventForm() {
  const [styles, setStyles] = useState([]);
  const [snsGroups, setSnsGroups] = useState([
    { id: uuidv4(), platform: "website" },
  ]);
  const textAreaRef = useRef(null);

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

  const handleStyleChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setStyles([...styles, value]);
    } else {
      setStyles(styles.filter((style) => style !== value));
    }
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
      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      // const response = await fetch("/events/create", {
      //   method: "POST",
      //   body: formData,
      // });
      // if (response.ok) {
      //   // Handle successful submission (e.g., redirect, show message)
      //   console.log("Event created successfully!");
      // } else {
      //   // Handle error
      //   console.error("Error creating event");
      // }
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
        <input type="date" id="date" name="date" required />
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
          <label htmlFor="salsa">
            <input
              className="style-checkbox"
              type="checkbox"
              id="salsa"
              name="style"
              value="salsa"
              onChange={handleStyleChange}
            />
            <div className="custom-checkbox"></div>
            Salsa
          </label>
          <label htmlFor="bachata">
            <input
              className="style-checkbox"
              type="checkbox"
              id="bachata"
              name="style"
              value="bachata"
              onChange={handleStyleChange}
            />
            <div className="custom-checkbox"></div>
            Bachata
          </label>
          <label htmlFor="kizomba">
            <input
              className="style-checkbox"
              type="checkbox"
              id="kizomba"
              name="style"
              value="kizomba"
              onChange={handleStyleChange}
            />
            <div className="custom-checkbox"></div>
            Kizomba
          </label>
          <label htmlFor="zouk">
            <input
              className="style-checkbox"
              type="checkbox"
              id="zouk"
              name="style"
              value="zouk"
              onChange={handleStyleChange}
            />
            <div className="custom-checkbox"></div>
            Zouk
          </label>
        </div>
        <label htmlFor="other">Other</label>
        <input type="text" id="other" name="style" />

        <div className="form-separator"></div>
        <h3 className="form-section-header">Venue</h3>

        <label htmlFor="country">Country:</label>
        <input type="text" id="country" name="country" required />
        <label htmlFor="city">City:</label>
        <input type="text" id="city" name="city" required />

        <label htmlFor="venue-name">Venue:</label>
        <input type="text" id="venue-name" name="venue-name" required />

        <label htmlFor="venue-url">Location:</label>
        <input
          type="text"
          id="venue-url"
          name="venue-url"
          placeholder="Google Maps link"
        />

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
            <button type="button" id="add-sns" onClick={handleAddSnsLink}>
              Add Link
            </button>
          )}
        </div>

        <div className="form-separator"></div>
        <h3 className="form-section-header">Flyer</h3>
        <label htmlFor="flyer">Upload Image:</label>
        <input type="file" accept="image/*" id="flyer" name="flyer" />

        <button type="submit" className="submit-event">
          Add Event
        </button>
      </form>
    </div>
  );
}

export default EventForm;
