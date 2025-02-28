import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserEvents from "./UserEvents.jsx";
import { v4 as uuidv4 } from "uuid";
import UserForm from "./UserForm.jsx";
import ConfirmEventDelete from "./ConfirmEventDelete.jsx";
import ConfirmUserDelete from "./ConfirmUserDelete.jsx";
import Modal from "./Modal.jsx";
import ProgressiveImage from "./ProgressiveImage.jsx";
import { useLogout } from "./userMutations.js";
import { useQueryClient } from "@tanstack/react-query";
import { useEvents } from "./eventQueries.js";

const Profile = () => {
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["currentUser"]);
  const { data: events, isLoading: eventsLoading } = useEvents();
  const csrfToken = queryClient.getQueryData(["csrfToken"]);
  const logoutMutation = useLogout();
  const [editMode, setEditMode] = useState(false);
  const [snsGroups, setSnsGroups] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const handleLogOut = async (event) => {
    event.preventDefault();
    navigate("/");
    logoutMutation.mutate(user.id);
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setShowDeleteUserModal(true);
  };

  const handleEditProfile = (event) => {
    event.preventDefault();
    setEditMode(true);
  };
  return (
    <>
      {showDeleteEventModal && (
        <Modal closeModal={setShowDeleteEventModal}>
          <ConfirmEventDelete
            eventId={eventId}
            userId={user.id}
            showModal={setShowDeleteEventModal}
            setEventId={setEventId}
          />
        </Modal>
      )}
      {showDeleteUserModal && (
        <Modal closeModal={setShowDeleteUserModal}>
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
                      <ProgressiveImage
                        imageKey={user.profilePic.src}
                        alt={user.profilePic.alt}
                        size="small"
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
                      <a
                        key={sns.id}
                        href={sns.url}
                        aria-label={sns.name}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
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
              csrfToken={csrfToken}
              snsGroups={snsGroups}
              setEditMode={setEditMode}
            />
          )}
        </div>

        <section className="user-events">
          {!eventsLoading && (
            <UserEvents
              user={user}
              events={events}
              canEdit={true}
              showModal={setShowDeleteEventModal}
              setEventId={setEventId}
            />
          )}
        </section>
      </article>
    </>
  );
};

export default Profile;
