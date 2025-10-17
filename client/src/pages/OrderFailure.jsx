import { useNavigate } from "react-router-dom";

export default function OrderFailure() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <h1 className="text-4xl font-bold text-red-700 mb-4">❌ Payment Failed</h1>
      <p className="text-gray-700 mb-6">
        Something went wrong with your payment. Please try again.
      </p>
      <button
        onClick={() => navigate("/checkout")}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}
