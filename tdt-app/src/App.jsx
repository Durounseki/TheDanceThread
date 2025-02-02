import "./App.css";
import Router from "./Router.jsx";
import AuthProvider from "./AuthProvider.jsx";

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
