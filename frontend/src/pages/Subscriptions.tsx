import { useEffect, useState } from "react";
import axios from "axios";
import type { IPlan } from "../interfaces/IPlan";

import type { RegisterOrToken } from "../models/CustomerModels";

export const Subscriptions = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [user, setUser] = useState<RegisterOrToken | null>(null);

  console.log(user);
  
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


  // Kollar användare i token och i registration så vi kan återanvända 
  // och upgradera prem med samma komponent.
  useEffect(() => {
  const token = sessionStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (e) {
      console.error("Fel vid tolkning av token:", e);
      setUser(null);
    }
  } else {
    const registration = sessionStorage.getItem("registration");
    if (registration) {
      try {
        const regUser = JSON.parse(registration);
        setUser(regUser);
      } catch (e) {
        console.error("Fel vid tolkning av registration:", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }
}, []);

  const handleSubscribe = async (priceId: string) => {

   const registration = {
                email: user?.email,
                subscriptionLevel: user?.subscriptionLevel
      }           
    
    if (!registration) {
      console.error("Ingen registrering hittades i sessionStorage");
      return;
    }

    const { email } = registration;
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
