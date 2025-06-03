import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/stripe/session/${sessionId}`
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
      <h1 className="text-2xl font-bold mb-4">Tack för ditt köp!</h1>
      {email ? (
        <p>
          En bekräftelse har skickats till <strong>{email}</strong>.
        </p>
      ) : (
        <p>Behandlar din beställning...</p>
      )}
    </div>
  );
};
