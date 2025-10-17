import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

export default function Account() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        navigate("/login");
      } else {
        setUser(data.session.user);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-100 bg-gradient-to-br from-purple-600 to-indigo-700 font-poppins">
        Loading account...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-purple-600 to-orange-700 py-12 px-6 flex flex-col items-center font-poppins text-gray-800">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-10 w-full max-w-2xl border border-white/30">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Account
        </h1>

        {/* Account Details */}
        <section className="mb-10 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Account Details
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {user.user_metadata.full_name}
              </p>
            )}
            <p>
              <span className="font-semibold">Account Created:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </section>

        {/* Order History */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Order History
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center border border-gray-200">
            You have no orders yet.
          </div>
        </section>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-transform transform hover:scale-[1.05] shadow-md"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

