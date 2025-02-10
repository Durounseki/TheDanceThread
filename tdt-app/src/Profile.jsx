import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./useAuth.jsx";
import UserEvents from "./UserEvents.jsx";
import { v4 as uuidv4 } from "uuid";
import UserForm from "./UserForm.jsx";
import ConfirmEventDelete from "./ConfirmEventDelete.jsx";
import ConfirmUserDelete from "./ConfirmUserDelete.jsx";
import Modal from "./Modal.jsx";

const Profile = () => {
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [profilePic, setProfilePic] = useState(undefined);
  const [styles, setStyles] = useState([]);
  const [snsGroups, setSnsGroups] = useState([]);
  const defaultSnsGroups = [{ id: uuidv4(), platform: "website", url: "" }];

  const navigate = useNavigate();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setCountry(user.country);
    setBio(user.bio);
    setAvatar(user.avatar);
    setProfilePic(user.profilePic);
    setStyles(user.styles.map((style) => style.name));
    setSnsGroups(
      user.sns.map((sns) => ({
        id: sns.id,
        platform: sns.name,
        url: sns.url,
      }))
    );
    setLoading(false);
  }, [user]);

  const handleLogOut = async (event) => {
    event.preventDefault();
    navigate("/");
    await logout();
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setShowDeleteUserModal(true);
    console.log("Account deleted successfully!");
  };

  const handleEditProfile = (event) => {
    event.preventDefault();
    setEditMode(true);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <>
      {showDeleteEventModal && (
        <Modal>
          <ConfirmEventDelete
            eventId={eventId}
            showModal={setShowDeleteEventModal}
            setEventId={setEventId}
          />
        </Modal>
      )}
      {showDeleteUserModal && (
        <Modal>
          <ConfirmUserDelete
            userId={user.id}
            showModal={setShowDeleteUserModal}
          />
        </Modal>
      )}
      <article className="profile-container">
        <div className="user-details">
          {!editMode ? (
            <>
              <section className="user-banner">
                <Link to={`/profile`}>
                  <figure className="profile-picture">
                    {profilePic ? (
                      <img src={profilePic.src} alt={profilePic.alt} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: avatar }} />
                    )}
                  </figure>
                </Link>
                <h1 className="user-name">{name}</h1>
                <p className="user-email">{email}</p>
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
              <section className="user-social-media">
                <span className="user-section-title">Social Media</span>
                {snsGroups.length > 0 ? (
                  <div className="user-sns">
                    {snsGroups.map((sns) => (
                      <a key={sns.id} href={sns.url} aria-label={sns.name}>
                        <i className={sns.faClass}></i>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>Nothing here...</p>
                )}
              </section>
              <section className="user-bio">
                <span className="user-section-title">Bio</span>
                {country && <p>From: {country}</p>}
                {bio && <p>{bio}</p>}
                {!country && !bio && <p>Nothing here...</p>}
              </section>
              <section className="user-styles">
                <span className="user-section-title">Dance Styles</span>
                {styles.length > 0 ? (
                  styles.map((style) => (
                    <span key={style} className="dance-style">
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </span>
                  ))
                ) : (
                  <p>Nothing here...</p>
                )}
              </section>
            </>
          ) : (
            <UserForm
              id={user.id}
              name={name}
              email={email}
              country={country}
              bio={bio}
              avatar={avatar}
              profilePic={profilePic}
              styles={styles}
              snsGroups={snsGroups.length > 0 ? snsGroups : defaultSnsGroups}
              setEditMode={setEditMode}
            />
          )}
        </div>
        <section className="user-events">
          <UserEvents
            user={user}
            canEdit={true}
            showModal={setShowDeleteEventModal}
            setEventId={setEventId}
          />
        </section>
      </article>
    </>
  ) : (
    <p>Please log in first.</p>
  );
};

export default Profile;
