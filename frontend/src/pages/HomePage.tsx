import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
	
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const reloaded = sessionStorage.getItem("hasReloaded");
    if (!token && !reloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
    if (token && reloaded) {
      sessionStorage.removeItem("hasReloaded");
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <h1 className="text-4xl font-bold mb-4">Huggtid</h1>
      <p className="text-lg">Välkommen!</p>
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-4 w-40 bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 transition duration-200"
      >
        Logga in
      </button>
      <button
        type="button"
        onClick={() => navigate("/register")}
        className="mt-4 w-40 bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 transition duration-200"
      >
        Registrera dig
      </button>
    </div>
  );
};
