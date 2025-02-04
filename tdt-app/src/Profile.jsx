import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <div>
      <p>Hello, {userInfo.name}!</p>
      <button onClick={handleLogOut} type="button">
        Log out
      </button>
    </div>
  ) : (
    <p>Please log in first.</p>
  );
};

export default Profile;
