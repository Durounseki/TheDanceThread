import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SnsGroup from "./SnsGroup";
import { v4 as uuidv4 } from "uuid";
import CustomCheckbox from "./CustomCheckbox";
import VenueInput from "./VenueInput";
import useAuth from "../../useAuth";

function EventForm() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueUrl, setVenueUrl] = useState("");
  const { user, loading } = useAuth();
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
    { id: uuidv4(), platform: "website", url: "" },
  ]);
  const [flyer, setFlyer] = useState(undefined);
  const textAreaRef = useRef(null);
  const dateRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/events/${eventId}`);
        const data = await response.json();
        setName(data.name);
        setDate(new Date(data.date).toISOString().substring(0, 10));
        setDescription(data.description);
        setCountry(data.country);
        setCity(data.city);
        setVenueName(data.venues[0].name);
        setVenueUrl(data.venues[0].url);
        setStyleOptions(
          styleOptions.map((option) =>
            data.styles.map((style) => style.name).includes(option.value)
              ? { ...option, checked: true }
              : option
          )
        );
        setSnsGroups(
          data.sns.map((sns) => ({
            id: sns.id,
            platform: sns.name,
            url: sns.url,
          }))
        );
        const flyerUrl = new URL(data.flyer.src);
        const flyerPathname = flyerUrl.pathname;
        const flyerFileName = flyerPathname
          .split("/")
          .pop()
          .replace(/^\d+-/, "");
        setFlyer({ ...data.flyer, fileName: flyerFileName });
      } catch (error) {
        console.error("Failed to fetch event info:", error);
      }
    };
    if (eventId) {
      fetchData();
    }
  }, [eventId, apiUrl]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const resizeTextArea = () => {
      textArea.style.height = "auto";
      textArea.style.height = `calc(${textArea.scrollHeight}px + 1em)`;
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
    event.preventDefault();
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

  const handleSnsUrl = (groupId, newUrl) => {
    setSnsGroups((prevSnsGroups) =>
      prevSnsGroups.map((group) =>
        group.id === groupId ? { ...group, url: newUrl } : group
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
    if (user) {
      formData.append("creatorId", user.id);
    }

    try {
      let response;

      if (eventId) {
        snsGroups.forEach((sns) => formData.append("sns-id[]", sns.id));
        formData.append("id", eventId);
        response = await fetch(`${apiUrl}/events/${eventId}`, {
          method: "PATCH",
          body: formData,
          credentials: "include",
        });
      } else {
        response = await fetch(`${apiUrl}/events`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }
      if (response.ok) {
        const responseData = await response.json();
        navigate(`/events/${responseData.id}`);
      } else {
        console.error("Error creating event");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/profile");
  };

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <label htmlFor="name">Event Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        required
        placeholder="The Dance Thread"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        name="date"
        required
        ref={dateRef}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={date === "" ? "empty" : ""}
      />
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        placeholder="Dance, share, celebrate yourself!"
        ref={textAreaRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
          placeholder="Add another style..."
          onChange={(event) => setOtherStyle(event.target.value)}
        />
        <button type="button" id="user-add-style" onClick={handleOtherStyle}>
          Add Style
        </button>
      </div>

      <div className="form-separator"></div>
      <VenueInput
        country={country}
        setCountry={setCountry}
        city={city}
        setCity={setCity}
        venueName={venueName}
        setVenueName={setVenueName}
        venueUrl={venueUrl}
        setVenueUrl={setVenueUrl}
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
            url={group.url}
            setUrl={(newUrl) => handleSnsUrl(group.id, newUrl)}
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
      {flyer && (
        <>
          <div className="event-thumb">
            <img src={flyer.src} alt={flyer.alt} />
          </div>
          <a
            href={flyer.src}
            rel="noopener noreferrer"
            target="_blank"
            className="flyer-filename"
          >
            {flyer.fileName}
          </a>
        </>
      )}
      <label htmlFor="flyer">Upload Image:</label>
      <input type="file" accept="image/*" id="flyer" name="flyer" />
      {eventId ? (
        <div className="edit-form-buttons">
          <button onClick={handleCancel} className="event-form-action">
            Cancel
          </button>
          <button type="submit" className="event-form-action">
            Save
          </button>
        </div>
      ) : (
        <button type="submit" className="event-form-action">
          Add Event
        </button>
      )}
    </form>
  );
}

export default EventForm;
