import { useState, useEffect, useRef } from "react";
import SnsGroup from "./Events/components/SnsGroup.jsx";
import { v4 as uuidv4 } from "uuid";
import CountrySelect from "./Events/components/CountrySelect.jsx";
import CustomCheckbox from "./Events/components/CustomCheckbox.jsx";
import ProgressiveImage from "./ProgressiveImage.jsx";

const UserForm = ({
  user,
  setUser,
  name,
  setName,
  email,
  setEmail,
  country,
  setCountry,
  bio,
  setBio,
  styles,
  setStyles,
  snsGroups,
  setSnsGroups,
  avatar,
  profilePic,
  setEditMode,
}) => {
  const [styleOptions, setStyleOptions] = useState([]);
  const textAreaRef = useRef(null);
  const [otherStyle, setOtherStyle] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/styles`);
        const data = await response.json();
        setStyleOptions(
          data.map((style) => ({
            id: style.id,
            value: style.name,
            text: style.name.charAt(0).toUpperCase() + style.name.slice(1),
            checked: styles.includes(style.name) ? true : false,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch styles:", error);
      }
    };
    fetchData();
  }, []);

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
      setStyles([...styles, newStyle.value]);
    }
    setOtherStyle("");
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

  const handleCancelEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setEditMode(false);
  };

  const handleShowFileUpload = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowFileUpload(!showFileUpload);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    snsGroups.forEach((sns) => formData.append("sns-id[]", sns.id));
    try {
      const response = await fetch(`${apiUrl}/users/${user.id}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...user,
          name: data.name,
          email: data.email,
          country: data.country,
          bio: data.bio,
          styles: data.styles,
          sns: data.sns,
        });
        setEditMode(false);
      } else {
        console.error("Error updating user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdatePicture = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("alt", name);
    try {
      const response = await fetch(`${apiUrl}/users/${user.id}/profile-pic`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...user,
          profilePic: data,
        });
        setShowFileUpload(false);
      } else {
        console.error("Error updating user profile picture");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeletePicture = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/users/${user.id}/profile-pic`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUser({
          ...user,
          profilePic: undefined,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form
        className="user-form profile-pic-form"
        encType="multipart/form"
        onSubmit={handleUpdatePicture}
      >
        <figure className="profile-picture edit">
          {profilePic ? (
            <ProgressiveImage
              imageKey={profilePic.src}
              alt={profilePic.alt}
              size="small"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: avatar }} />
          )}
        </figure>

        <div className="edit-profile-pic-submit">
          {!showFileUpload && (
            <button onClick={handleShowFileUpload}>Update</button>
          )}
          {showFileUpload && (
            <button onClick={handleShowFileUpload}>Cancel</button>
          )}
          <button
            className={!profilePic ? "disabled" : ""}
            onClick={handleDeletePicture}
          >
            Delete
          </button>
        </div>
        {showFileUpload && (
          <>
            <label htmlFor="profilePic">Upload:</label>
            <input
              type="file"
              accept="image/*"
              id="profilePic"
              name="profilePic"
            />
            <button className="event-form-button" type="submit">
              Update Picture
            </button>
          </>
        )}
      </form>
      <form
        className="user-form"
        encType="multipart/form-data"
        onSubmit={handleSaveProfile}
      >
        <h3 className="form-section-header">About me</h3>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          name="name"
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
        />
        <CountrySelect value={country} onSelect={setCountry} />
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Dance, share, celebrate yourself!"
          ref={textAreaRef}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
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
              required={false}
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
        <div className="edit-profile-submit">
          <button type="submit">Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      </form>
    </>
  );
};

export default UserForm;
