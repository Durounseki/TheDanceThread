import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./useAuth.jsx";
import UserEvents from "./UserEvents.jsx";
import { v4 as uuidv4 } from "uuid";
import SnsGroup from "./Events/components/SnsGroup.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [snsGroups, setSnsGroups] = useState([
    { id: uuidv4(), platform: "website" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/protected`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogOut = async (event) => {
    event.preventDefault();
    navigate("/");
    await logout();
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    console.log("Account deleted successfully!");
  };

  const handleEditProfile = (event) => {
    event.preventDefault();
    setUserName(userInfo.name);
    setUserEmail(userInfo.email);
    setEditMode(!editMode);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setEditMode(!editMode);
    console.log("Profile updated!");
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <article className="profile-container">
      <div className="user-details">
        {!editMode ? (
          <section className="user-banner">
            <Link to={`/profile`}>
              <figure className="profile-picture">
                <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
              </figure>
            </Link>
            <h1 className="user-name">{userInfo.name}</h1>
            <p className="user-email">{userInfo.email}</p>
            {userInfo.sns.length > 0 && (
              <div className="user-sns">
                {userInfo.sns.map((sns) => (
                  <a key={sns.id} href={sns.url} aria-label={sns.name}>
                    <i className={sns.faClass}></i>
                  </a>
                ))}
              </div>
            )}
            <button className="user-button" onClick={handleEditProfile}>
              Edit
            </button>
            <button className="user-button" onClick={handleLogOut}>
              Logout
            </button>
            <button
              className="user-button delete-account"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </section>
        ) : (
          <form className="user-form" onSubmit={handleSaveProfile}>
            <figure className="profile-picture edit">
              <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
              <i className="fa-solid fa-pencil"></i>
            </figure>
            <button className="save-profile" type="submit">
              Save Profile
            </button>
            <label htmlFor="user-name">Name:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              id="user-name"
              name="user-name"
            />
            <label htmlFor="user-email">Email:</label>
            <input
              type="text"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              id="user-email"
              name="user-email"
            />
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
          </form>
        )}
      </div>
      <section className="user-events">
        <UserEvents user={user} />
      </section>
    </article>
  ) : (
    <p>Please log in first.</p>
  );
};

export default Profile;
