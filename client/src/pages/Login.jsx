import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import googleIcon from "../assets/googleIcon.png";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) navigate("/");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/"); // redirect immediately after login
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // Google login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome</h1>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 py-3 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <img
            src={googleIcon}
            alt="Google Icon"
            className="w-6 h-6"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        <p className="mt-6 text-gray-500 text-sm">
          By continuing, you agree to our{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Terms</span> and{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
