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
  const { user, setUser, logout } = useAuth();
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

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    setName(user.name);
    setEmail(user.email);
    setCountry(user.country || "");
    setBio(user.bio || "");
    setAvatar(user.avatar);
    setProfilePic(user.profilePic);
    setStyles(user.styles.map((style) => style.name));
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
                    {user.profilePic ? (
                      <img
                        src={user.profilePic.src}
                        alt={user.profilePic.alt}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: user.avatar }} />
                    )}
                  </figure>
                </Link>
                <h1 className="user-name">{user.name}</h1>
                <p className="user-email">{user.email}</p>
                <div className="user-banner-buttons">
                  <button className="user-button" onClick={handleEditProfile}>
                    Edit
                  </button>
                  <button className="user-button" onClick={handleLogOut}>
                    Logout
                  </button>
                </div>
                <button
                  className="user-button delete-account"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </section>
              <section className="user-social-media">
                <span className="user-section-title">Social Media</span>
                {user.sns.length > 0 ? (
                  <div className="user-sns">
                    {user.sns.map((sns) => (
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
                {user.country && <p>From: {user.country}</p>}
                {user.bio && <p>{user.bio}</p>}
                {!user.country && !user.bio && <p>Nothing here...</p>}
              </section>
              <section className="user-styles">
                <span className="user-section-title">Dance Styles</span>
                {user.styles.length > 0 ? (
                  user.styles.map((style) => (
                    <span key={style.id} className="dance-style">
                      {style.name.charAt(0).toUpperCase() + style.name.slice(1)}
                    </span>
                  ))
                ) : (
                  <p>Nothing here...</p>
                )}
              </section>
            </>
          ) : (
            <UserForm
              user={user}
              setUser={setUser}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              country={country}
              setCountry={setCountry}
              bio={bio}
              setBio={setBio}
              avatar={avatar}
              profilePic={profilePic}
              styles={styles}
              setStyles={setStyles}
              snsGroups={snsGroups}
              setSnsGroups={setSnsGroups}
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
