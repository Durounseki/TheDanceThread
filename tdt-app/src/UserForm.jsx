import { useState, useEffect, useRef } from "react";
import SnsGroup from "./Events/components/SnsGroup.jsx";
import { v4 as uuidv4 } from "uuid";
import CountrySelect from "./Events/components/CountrySelect.jsx";
import CustomCheckbox from "./Events/components/CustomCheckbox.jsx";
import ProgressiveImage from "./ProgressiveImage.jsx";
import { useDanceStyles } from "./otherQueries.js";
import { useSaveProfile } from "./userMutations.js";
import { useUpdatePicture, useDeletePicture } from "./userMutations.js";

const UserForm = ({ user, setEditMode }) => {
  const { data: danceStyles } = useDanceStyles();
  const saveProfile = useSaveProfile();
  const updatePicture = useUpdatePicture();
  const deletePicture = useDeletePicture();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [country, setCountry] = useState(user.country);
  const [bio, setBio] = useState(user.bio);
  const [styleOptions, setStyleOptions] = useState([]);
  const [snsGroups, setSnsGroups] = useState(user.sns);
  const textAreaRef = useRef(null);
  const [otherStyle, setOtherStyle] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [fileError, setFileError] = useState(null);
  const MAX_FILE_SIZE = 1024 * 1024;
  const MAX_BIO_LENGTH = 2000;

  useEffect(() => {
    if (danceStyles) {
      setStyleOptions(
        danceStyles.map((style) => ({
          id: style.id,
          value: style.name,
          text: style.name.charAt(0).toUpperCase() + style.name.slice(1),
          checked: user.styles.find((item) => item.name === style.name)
            ? true
            : false,
        }))
      );
    }
  }, [danceStyles, user]);

  useEffect(() => {
    if (user.sns.length > 0) {
      setSnsGroups(
        user.sns.map((sns) => ({
          id: sns.id,
          platform: sns.name,
          url: sns.url,
          faClass: sns.faClass,
        }))
      );
    } else {
      setSnsGroups([{ id: uuidv4(), platform: "website", url: "" }]);
    }
  }, [user]);

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
    saveProfile.mutate({ user, formData });
    setEditMode(false);
  };

  const handleBioChange = (event) => {
    const text = event.target.value;
    if (text.length > MAX_BIO_LENGTH) {
      event.target.value = text.slice(0, MAX_BIO_LENGTH);
      return;
    }
    setBio(text);
  };

  const handleFileChange = (event) => {
    setFileError(null);
    const file = event.target.files[0];

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      );
      event.target.value = "";
      return;
    }
  };

  const handleUpdatePicture = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("alt", name);
    updatePicture.mutate({ user, formData });
    setShowFileUpload(false);
  };

  const handleDeletePicture = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    deletePicture.mutate({ user, formData });
    setShowFileUpload(false);
  };

  return (
    <>
      <form
        className="user-form profile-pic-form"
        encType="multipart/form"
        onSubmit={handleUpdatePicture}
      >
        <input
          type="text"
          id="title"
          name="title"
          autoComplete="off"
          style={{ visibility: "hidden", position: "absolute" }}
        />
        <figure className="profile-picture edit">
          {user.profilePic ? (
            <ProgressiveImage
              imageKey={user.profilePic.src}
              alt={user.profilePic.alt}
              size="small"
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
          )}
        </figure>

        <div className="edit-profile-pic-submit">
          {!showFileUpload && (
            <button type="submit" onClick={handleShowFileUpload}>
              Update
            </button>
          )}
          {showFileUpload && (
            <button onClick={handleShowFileUpload}>Cancel</button>
          )}
          <button
            type="submit"
            className={!user.profilePic ? "disabled" : ""}
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
              onChange={handleFileChange}
              className={fileError ? "input-error" : ""}
            />
            {fileError && <p className="form-error">{fileError}</p>}

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
        <input
          type="text"
          id="age"
          name="age"
          autoComplete="off"
          style={{ visibility: "hidden", position: "absolute" }}
        />
        <h3 className="form-section-header">About me</h3>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          name="name"
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          name="email"
          required
        />
        <CountrySelect value={country} onSelect={setCountry} />
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          placeholder="Dance, share, celebrate yourself!"
          ref={textAreaRef}
          value={bio ? bio : ""}
          onChange={handleBioChange}
        ></textarea>
        <p className="character-counter">
          {bio ? bio.length : 0}/{MAX_BIO_LENGTH}
        </p>
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleOtherStyle(event);
              }
            }}
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
