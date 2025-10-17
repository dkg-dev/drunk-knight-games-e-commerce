import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { Star } from "lucide-react";

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching game:", error);
      } else {
        setGame(data);
      }
      setLoading(false);
    };

    fetchGame();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading game...</p>;
  if (!game) return <p className="text-center py-10 text-gray-500">Game not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Title and Basic Info */}
      <h1 className="text-4xl font-bold text-[#6B0899] mb-4">{game.title}</h1>
      <p className="text-gray-700 text-lg mb-6">{game.description}</p>

      <div className="flex flex-wrap gap-6 items-center mb-8 text-gray-800">
        {/* Players */}
        <p className="font-medium bg-purple-100 px-4 py-2 rounded-lg">
          👥 Players: {game.min_players}{game.max_players ? `–${game.max_players}` : "+"}
        </p>

        {/* Type */}
        <p className="font-medium bg-orange-100 px-4 py-2 rounded-lg">🎲 Type: {game.type}</p>

        {/* Tipsy Rating */}
        <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
          <span className="font-medium mr-2">🍻 Tipsy Rating:</span>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < game.tipsy_rating ? "text-yellow-500 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-[#6B0899]">What You Need</h3>
        <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-lg border">
          {/* Alcohol Requirement */}
          {game.alcohol_requirement && (
            <span className="px-4 py-2 bg-red-100 text-red-700 font-medium rounded-full border border-red-200">
              {game.alcohol_requirement}
            </span>
          )}

          {/* Game Requirements */}
          {game.requirements?.length > 0 ? (
            game.requirements.map((item, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-full border border-purple-200"
              >
                {item}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No special equipment needed.</p>
          )}
        </div>
      </div>

      {/* Setup Steps */}
      {game.setup?.length > 0 && (
        <div className="mb-10">
          <h3 className="text-2xl font-semibold mb-3 text-[#6B0899]">Setup</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-gray-50 p-6 rounded-lg border leading-relaxed">
            {game.setup.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Setup Image */}
      {game.setup_image && (
        <div className="mb-6 flex justify-center">
          <img
            src={game.setup_image}
            alt="Setup"
            className="rounded-lg border w-50"
          />
        </div>
      )}

      {/* How to Play */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-[#6B0899]">How to Play</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 bg-gray-50 p-6 rounded-lg border leading-relaxed">
          {game.instructions?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>

        {/* Instruction Images */}
        {game.instruction_images?.length > 0 && (
          <div className="mt-6 grid gap-4">
            {game.instruction_images.map((img, index) => (
              <div key={index} className="text-center">
                <img
                  src={img.url}
                  alt={`Instruction ${index + 1}`}
                  className="rounded-lg border w-full"
                />
                {img.tag && <p className="text-sm text-gray-500 mt-1">{img.tag}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
