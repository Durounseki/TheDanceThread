import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SnsGroup from "./SnsGroup";
import { v4 as uuidv4 } from "uuid";
import CustomCheckbox from "./CustomCheckbox";
import VenueInput from "./VenueInput";
import ProgressiveImage from "../../ProgressiveImage";
import DatePicker from "react-datepicker";
import { addYears } from "date-fns";
import "../../DatePicker.css";
import { useQueryClient } from "@tanstack/react-query";
import { useEvent } from "../../eventQueries";
import { useCreateEvent, useSaveEvent } from "../../eventMutations";

function EventForm() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const { data: currentEvent, isLoading: eventLoading } = useEvent(eventId);
  const createEvent = useCreateEvent();
  const saveEvent = useSaveEvent();
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueUrl, setVenueUrl] = useState("");
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["currentUser"]);
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
  const [thumbnail, setThumbnail] = useState("");
  const [fileError, setFileError] = useState(null);
  const MAX_FILE_SIZE = 1024 * 1024;
  const textAreaRef = useRef(null);
  const MAX_DESCRIPTION_LENGTH = 2000;
  const imgUrl = import.meta.env.VITE_IMAGES_URL;

  useEffect(() => {
    if (currentEvent) {
      setName(currentEvent.name);
      setDate(new Date(currentEvent.date).toISOString().substring(0, 10));
      setDescription(currentEvent.description);
      setCountry(currentEvent.country);
      setCity(currentEvent.city);
      setVenueName(currentEvent.venues[0].name);
      setVenueUrl(currentEvent.venues[0].url);
      setStyleOptions(
        styleOptions.map((option) =>
          currentEvent.styles.map((style) => style.name).includes(option.value)
            ? { ...option, checked: true }
            : option
        )
      );
      setSnsGroups(
        currentEvent.sns.map((sns) => ({
          id: sns.id,
          platform: sns.name,
          url: sns.url,
        }))
      );
      const thumbnailUrl = imgUrl + currentEvent.flyer.src;
      const thumbnailFileName = currentEvent.flyer.src.replace(/^\d+-/, "");
      setThumbnail({
        ...currentEvent.flyer,
        href: thumbnailUrl,
        fileName: thumbnailFileName,
      });
    }
  }, [currentEvent]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;
    const resizeTextArea = () => {
      textArea.style.height = "auto";
      textArea.style.height = `calc(${textArea.scrollHeight}px + 1em)`;
    };
    textArea.addEventListener("input", resizeTextArea);

    resizeTextArea();
    return () => textArea.removeEventListener("input", resizeTextArea);
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

  const handleFileChange = (event) => {
    setFileError(null);
    const file = event.target.files[0];

    if (!file) {
      setFlyer(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      );
      event.target.value = "";
      return;
    }

    setFlyer(file);
  };

  const handleDescriptionChange = (event) => {
    const text = event.target.value;
    if (text.length > MAX_DESCRIPTION_LENGTH) {
      event.target.value = text.slice(0, MAX_DESCRIPTION_LENGTH);
      return;
    }
    setDescription(text);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    if (user) {
      formData.append("creatorId", user.id);
    }
    let data;
    if (eventId) {
      snsGroups.forEach((sns) => formData.append("sns-id[]", sns.id));
      formData.append("id", eventId);
      data = await saveEvent.mutateAsync({
        formData: formData,
        event: currentEvent,
      });
    } else {
      data = await createEvent.mutateAsync({
        formData: formData,
        userId: user.id,
      });
    }
    navigate(`/events/${data.id}`);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/profile");
  };

  if (eventLoading) {
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
      <div className="event-datepicker-container">
        <DatePicker
          id="date"
          name="date"
          autoComplete="off"
          selected={date}
          onChange={(dateValue) => setDate(dateValue)}
          showIcon
          icon="fa fa-calendar"
          toggleCalendarOnIconClick
          isClearable
          placeholderText="YYYY/MM/DD"
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
          maxDate={addYears(new Date(), 2)}
        />
      </div>
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        placeholder="Dance, share, celebrate yourself!"
        ref={textAreaRef}
        value={description}
        onChange={handleDescriptionChange}
      ></textarea>
      <p className="character-counter">
        {description.length}/{MAX_DESCRIPTION_LENGTH}
      </p>

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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleOtherStyle(event);
            }
          }}
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
      {thumbnail && (
        <>
          <div className="event-thumb">
            <ProgressiveImage
              imageKey={thumbnail.src}
              alt={thumbnail.alt}
              size="small"
            />
          </div>
          <a
            href={thumbnail.href}
            rel="noopener noreferrer"
            target="_blank"
            className="flyer-filename"
          >
            {thumbnail.fileName}
          </a>
        </>
      )}

      <label htmlFor="flyer">Upload Image:</label>
      <input
        type="file"
        accept="image/*"
        id="flyer"
        name="flyer"
        onChange={handleFileChange}
        className={fileError ? "input-error" : ""}
      />
      {fileError && <p className="form-error">{fileError}</p>}

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
