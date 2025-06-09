import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticle } from "../hooks/useArticle";
import { DashboardArticles } from "../components/DashboardArticles";
import {
  cancelSubscription,
  checkSubscriptionStatus,
} from "../services/customerServices";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    email?: String;
    subscriptionLevel?: string;
    subscriptionExpiresAt?: string;
  } | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [subCanceld, setSubCanceld] = useState<boolean>(false);
  const { articles, lockedArticles, isloading, totalPages, getallArticles } =
    useArticle();

  const subLevelDisplay: Record<string, string> = {
    free: "Gratis",
    basic: "Fiskepass",
    plus: "Fiskeguide",
    full: "Mästerfiskare",
  };

  useEffect(() => {
    const CheckStatus = async () => {
      const status = await checkSubscriptionStatus();
      setSubCanceld(status);
    };
    CheckStatus();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    getallArticles(pageNumber, user?.subscriptionLevel, searchQuery);
  }, [pageNumber, searchQuery, user]);

  const handleSubscription = () => {
    navigate("/subscriptions");
  };

  const handleCancel = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Ingen token hittades. Logga in igen.");
      return;
    }
    try {
      const response = await cancelSubscription(token);

      setSubCanceld(true);
      setUser((prev) =>
        prev
          ? {
              ...prev,
              subscriptionLevel: prev.subscriptionLevel,
              subscriptionExpiresAt: response.subscriptionExpiresAt,
            }
          : null
      );
    } catch (error) {
      console.error("Kunde inte avsluta prenumeration:", error);
      alert("Något gick fel.");
    }
  };

  return (
    <div className="flex flex-col items-center flex-grow bg-gray-900">
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Är du säker på att du vill avsluta din prenumeration?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Avbryt
              </button>
              <button
                onClick={async () => {
                  setShowConfirmCancel(false);
                  await handleCancel();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Bekräfta
              </button>
            </div>
          </div>
        </div>
      )}

      {user ? (
        <div className="w-full max-w-6xl px-4 py-8">
          <h1 className="text-5xl font-bold mb-8 text-white text-center">
            Välkommen, {user.email}!
          </h1>
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex flex-col items-start">
              <p className="text-white text-lg mb-1">
                <strong>
                  Prenumeration:{" "}
                  {subLevelDisplay[user.subscriptionLevel ?? "free"]}
                </strong>
              </p>
              <p className="text-white text-lg mb-4">
                Prenumeration gäller till:{" "}
                {user.subscriptionExpiresAt
                  ? new Date(user.subscriptionExpiresAt).toLocaleDateString(
                      "sv-SE"
                    )
                  : "okänt"}
              </p>
              {!subCanceld ? (
                <button
                  onClick={() => setShowConfirmCancel(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Ta bort prenumeration
                </button>
              ) : (
                <button
                  onClick={handleSubscription}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  prenumera
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("token");
                setUser(null);
                navigate("/");
                setTimeout(() => {
                  navigate(0);
                }, 100);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              Logga ut
            </button>
          </div>
          <div className="flex justify-center mb-8">
            <input
              placeholder="Sök på titel"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md bg-gray-700 border border-gray-600 p-2 rounded text-white"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col min-h-[400px] max-h-[700px]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Tillgängliga artiklar
              </h2>
              <div className="flex-1 min-h-[200px]">
                <DashboardArticles
                  articles={articles}
                  lockedArticles={[]}
                  userLevel={user.subscriptionLevel || "free"}
                  isLoading={isloading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showAccessibleOnly={true}
                />
              </div>
            </div>
            <div className="flex-1 bg-gray-800 rounded-lg p-4 shadow-lg flex flex-col min-h-[400px] max-h-[700px]">
              <h2 className="text-xl font-semibold text-white mb-4">
                Låsta artiklar
              </h2>
              <div className="flex-1 min-h-[200px] max-h-[500px] overflow-y-auto pr-2">
                <DashboardArticles
                  articles={[]}
                  lockedArticles={lockedArticles}
                  userLevel={user.subscriptionLevel || "free"}
                  isLoading={isloading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  showAccessibleOnly={false}
                />
              </div>
            </div>
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2 mt-8 justify-center">
              <button
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Föregående
              </button>
              <span className="text-white">
                {pageNumber} / {totalPages}
              </span>
              <button
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber === totalPages}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Nästa
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-16">
          <p className="text-white">Du är inte inloggad.</p>
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
