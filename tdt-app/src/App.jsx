import "./App.css";
import Router from "./Router.jsx";
// import AuthProvider from "./AuthProvider.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AuthProvider> */}
      <Router />
      {/* </AuthProvider> */}
    </QueryClientProvider>
  );
}

export default App;
