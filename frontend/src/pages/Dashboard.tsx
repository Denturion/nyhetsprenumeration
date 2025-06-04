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

  const handleCancel = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Ingen token hittades. Logga in igen.");
      return;
    }

    try {
      await fetch("http://localhost:5000/customers/cancel-subscription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionLevel: "free",
              subscriptionExpiresAt: undefined,
            }
          : null
      );

      alert("Prenumerationen har avslutats.");
    } catch (error) {
      console.error("Kunde inte avsluta prenumeration:", error);
      alert("Något gick fel.");
    }
  };

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
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Ta bort prenumeration
          </button>
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
