const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = () => {
    console.log(`${apiUrl}/auth/login`);
    window.location.href = `${apiUrl}/auth/login`;
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
