export const MySubscriptions = () => {
  return (
    //Visa nivå 
    //Visa utgångsdatum och nästa dragning 
    ///Knapp för att avbryta

    <>
      <h2>My Subscriptions</h2>
      
      prenumeration
      <div className="p-6">
        <h2 className="text-xl font-bold">Din prenumeration</h2>
        <p>Nivå: {subscription.planName}</p>
        <p>Förnyas: {subscription.renewsAt}</p>

        <div className="mt-4 flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Ändra nivå
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Avsluta prenumeration
          </button>
        </div>
      </div>
    </>
  );
};
