import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    sessionStorage.removeItem("registration");

    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}stripe/session/${sessionId}`
        );
        setEmail(res.data.customer_email);
      } catch (err) {
        console.error("Kunde inte hämta session:", err);
      }
    };

    fetchSession();
  }, [sessionId]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Tack för ditt köp!</h2>
      {email ? (
        <p>
          En bekräftelse har skickats till <strong>{email}</strong>.
        </p>
      ) : (
        <p>Behandlar din beställning...</p>
      )}
      <a href="/login">Klicka här för att logga in!</a>
    </div>
  );
};
