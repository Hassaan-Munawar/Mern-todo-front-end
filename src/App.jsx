import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Todos from "./pages/Todos";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/todos" /> : <AuthPage />} />
        <Route path="/todos" element={!user ? <Navigate to="/" /> : <Todos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

