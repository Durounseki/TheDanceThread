const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/login`;
  };

  return (
    <>
      <div className="login-form-container">
        <p>Continue with</p>
        <button onClick={handleLogin}>
          <i className="fa-brands fa-google"></i>
        </button>
      </div>
    </>
  );
};

export default Login;
