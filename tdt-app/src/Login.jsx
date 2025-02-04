const Login = ({ closeLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/login`;
  };
  const handleClose = (event) => {
    event.preventDefault();
    closeLogin(false);
  };

  return (
    <>
      <div className="login-form-container">
        <button className="close-button" onClick={handleClose}>
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        <h2>Continue with</h2>
        <button onClick={handleLogin}>
          <i className="fa-brands fa-google"></i>
          <p>Google</p>
        </button>
        <p>
          By continuing you agree to The Dance Thread&apos;s{" "}
          <a href="/terms-of-service" rel="noopener noreferrer" target="_blank">
            terms of service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
