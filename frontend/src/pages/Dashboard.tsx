import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email?: String;
    subscriptionLevel?: string;
	subscriptionExpiresAt?: string;
  } | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <div>
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg">Välkommen, {user.email}!</p>
          <p>
            <strong>Prenumeration: {user.subscriptionLevel}</strong>
          </p>
          <p>
            Prenumeration gäller till:{" "}
            {user.subscriptionExpiresAt
              ? new Date(user.subscriptionExpiresAt).toLocaleDateString("sv-SE")
              : "okänt"}
          </p>
        </div>
      ) : (
        <div>
          <p>Du är inte inloggad.</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Klicka här för att logga in.
          </button>
        </div>
      )}
    </div>
  );
};
