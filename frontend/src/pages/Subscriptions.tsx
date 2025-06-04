import { useEffect, useState } from "react";
import axios from "axios";
import type { IPlan } from "../interfaces/IPlan";

export const Subscriptions = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/stripe/plans`
        );
        setPlans(res.data);
        console.log("Prenumerationer hämtade:", res.data);
      } catch (err: any) {
        console.error("Kunde inte hämta prenumerationer:", err.message);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    const registration = sessionStorage.getItem("registration");

    if (!registration) {
      console.error("Ingen registrering hittades i sessionStorage");
      return;
    }

    const { email } = JSON.parse(registration);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/stripe/create-session`,
        {
          priceId,
          customerEmail: email,
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      console.error("Kunde inte skapa checkout session:", err.message);
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 p-6">
      {plans.map((plan) => (
        <div key={plan.id} className="border rounded p-4 shadow">
          <img
            src={plan.image}
            alt={plan.name}
            className="max-w-[200px] max-h-[200px] object-contain mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{plan.name}</h2>
          <p>{plan.description}</p>
          <p className="font-semibold mt-2">{plan.price} kr/mån</p>
          <button
            onClick={() => handleSubscribe(plan.id)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Välj denna
          </button>
        </div>
      ))}
    </div>
  );
};
