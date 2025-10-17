import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BiSolidDrink } from "react-icons/bi";
import { FaDice, FaRegComments } from "react-icons/fa";
import { GiCardJoker, GiPartyPopper } from "react-icons/gi";
import { TbBeerFilled } from "react-icons/tb";
import { MdOutlineAllInclusive } from "react-icons/md";
import supabase from "../supabaseClient";

const typeIcons = {
  All: MdOutlineAllInclusive,
  Card: GiCardJoker,
  Cups: TbBeerFilled,
  Dice: FaDice,
  Verbal: FaRegComments,
  Party: GiPartyPopper,
};

const typeGradients = {
  All: ["#9ca3af", "#6b7280"],
  Card: ["#22c55e", "#078a37"],
  Cups: ["#eab308", "#a16207"],
  Dice: ["#ef4444", "#a60c0c"],
  Verbal: ["#3b82f6", "#07318d"],
  Party: ["#ec4899", "#a30a4e"],
};

export default function RandomGames() {
  const [randomGames, setRandomGames] = useState([]);

  useEffect(() => {
    const fetchRandomGames = async () => {
      const { data, error } = await supabase.from("games").select("*");
      if (error) return console.error("Error fetching games:", error);

      const shuffled = data.sort(() => 0.5 - Math.random());
      setRandomGames(shuffled.slice(0, 5));
    };

    fetchRandomGames();
  }, []);

  if (!randomGames.length) return <p className="text-center py-10">Loading games...</p>;

  const renderTipsyRating = (rating) =>
    [...Array(5)].map((_, i) => {
      if (i < rating - 1) {
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-full mr-1"
            style={{ background: "linear-gradient(135deg, #a78bfa, #f97316)" }}
          />
        );
      } else if (i === rating - 1) {
        return (
          <div
            key={i}
            className="w-6 h-6 flex items-center justify-center rounded-full mr-1"
            style={{ background: "linear-gradient(135deg, #a78bfa, #f97316)" }}
          >
            <BiSolidDrink className="w-4 h-4 text-white" />
          </div>
        );
      } else {
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-full mr-1 border border-gray-300 bg-white"
          />
        );
      }
    });

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-[#6B0899]">Try out some of these drinking games:</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10">
          {randomGames.map((game) => {
            const IconComponent = typeIcons[game.type] || MdOutlineAllInclusive;
            const baseColor = typeGradients[game.type]?.[0] || "#9ca3af";

            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="relative border rounded-2xl p-6 flex flex-col justify-between bg-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg group"
                style={{ transition: "background-color 0.4s ease, transform 0.2s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = baseColor;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#000";
                }}
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-white">
                    {game.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2 transition-colors duration-300 group-hover:text-gray-100">
                    Players: {game.max_players ? `${game.min_players}-${game.max_players}` : `${game.min_players}+`}
                  </p>
                  <div className="flex items-center mt-4">
                    {renderTipsyRating(game.tipsy_rating)}
                  </div>
                  {IconComponent && (
                    <div
                      className="absolute bottom-3 right-3 text-white text-2xl rounded-full p-2"
                      style={{ backgroundColor: baseColor, transition: "background-color 0.4s ease" }}
                    >
                      <IconComponent />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* See All Link */}
        <div className="mt-8">
          <Link
            to="/games"
            className="text-[#F4761B] font-semibold hover:underline text-lg"
          >
            See All Games →
          </Link>
        </div>
      </div>
    </section>
  );
}
