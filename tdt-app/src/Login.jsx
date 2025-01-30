// import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const authUrl = import.meta.env.VITE_AUTH_API_URL;
  const handleLogin = () => {
    window.location.href = `${authUrl}/auth/login`;
  };

  return (
    <>
      <div className="login-form-container">
        <h1>Welcome back</h1>
        <p>Continue with</p>
        <button onClick={handleLogin}>
          <i className="fa-brands fa-google"></i>
        </button>
      </div>
    </>
  );
};

export default Login;
