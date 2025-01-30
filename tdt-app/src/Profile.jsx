import { useEffect, useState } from "react";

const Profile = () => {
  const authUrl = import.meta.env.VITE_AUTH_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${authUrl}/protected`, {
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>{user ? <p>Hello, {user}!</p> : <p>Please log in first.</p>}</div>
  );
};

export default Profile;
