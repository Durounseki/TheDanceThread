import { useEffect, useState } from "react";

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setUser(data.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        console.log(await response.json());
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <div>
      <p>Hello, {user}!</p>
      <button onClick={handleLogOut} type="button">
        Log out
      </button>
    </div>
  ) : (
    <p>Please log in first.</p>
  );
};

export default Profile;
