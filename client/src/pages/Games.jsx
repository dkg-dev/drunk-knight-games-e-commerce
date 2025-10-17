import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import { FaDice, FaRegComments } from "react-icons/fa";
import { GiCardJoker, GiPartyPopper } from "react-icons/gi";
import { TbBeerFilled } from "react-icons/tb";
import { MdOutlineAllInclusive } from "react-icons/md";
import { BiSolidDrink } from "react-icons/bi";

import supabase from "../supabaseClient";
import "../style/tab.css";

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

export default function Games() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [playerFilter, setPlayerFilter] = useState("");
  const [requirementFilter, setRequirementFilter] = useState("");
  const [alcoholFilter, setAlcoholFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tipsyRatingFilter, setTipsyRatingFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const itemsPerPage = rowsPerPage * 4; 

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase.from("games").select("*");
      if (error) console.error("Error fetching games:", error);
      else {
        setGames(data || []);
        setFilteredGames(data || []);
      }
      setLoading(false);
    };
    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    if (searchTerm) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (playerFilter) {
      filtered = filtered.filter(
        (game) =>
          game.min_players <= Number(playerFilter) &&
          (game.max_players ? game.max_players >= Number(playerFilter) : true)
      );
    }

    if (requirementFilter) {
      filtered = filtered.filter(
        (game) =>
          Array.isArray(game.requirements) &&
          game.requirements.includes(requirementFilter)
      );
    }

    if (alcoholFilter) {
      filtered = filtered.filter(
        (game) =>
          game.alcohol_requirement?.toLowerCase() ===
          alcoholFilter.toLowerCase()
      );
    }

    if (typeFilter && typeFilter !== "All") {
      filtered = filtered.filter(
        (game) => game.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (tipsyRatingFilter) {
      filtered = filtered.filter(
        (game) => Number(game.tipsy_rating) === Number(tipsyRatingFilter)
      );
    }

    setFilteredGames(filtered);
    setCurrentPage(1);
  }, [
    searchTerm,
    playerFilter,
    requirementFilter,
    alcoholFilter,
    typeFilter,
    tipsyRatingFilter,
    games,
  ]);

  if (loading) return <p className="p-10 text-center">Loading games...</p>;
  if (!games.length) return <p className="p-10 text-center">No games found.</p>;

  const renderTipsyRating = (rating) =>
    [...Array(5)].map((_, i) => {
      if (i < rating - 1) {
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-full mr-1"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #f97316)",
            }}
          />
        );
      } else if (i === rating - 1) {
        return (
          <div
            key={i}
            className="w-6 h-6 flex items-center justify-center rounded-full mr-1"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #f97316)",
            }}
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

  const types = ["All", "Card", "Cups", "Dice", "Verbal", "Party"];

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const currentGames = filteredGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border-1 border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
          />
        </div>

        <select
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          className="px-4 py-2 border-1 border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
        >
          <option value="">Players</option>
          <option value="2">2 Players</option>
          <option value="3">3 Players</option>
          <option value="4">4 Players</option>
          <option value="5">5 Players</option>
          <option value="6">6+ Players</option>
        </select>

        <select
          value={requirementFilter}
          onChange={(e) => setRequirementFilter(e.target.value)}
          className="px-4 py-2 border-1 border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
        >
          <option value="">Game Requirements</option>
          <option value="Just Drinks">Just Drinks</option>
          <option value="Cards">Cards</option>
          <option value="Dice">Dice</option>
          <option value="Cups">Cups & Ball</option>
        </select>

        <select
          value={alcoholFilter}
          onChange={(e) => setAlcoholFilter(e.target.value)}
          className="px-4 py-2 border-1 border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
        >
          <option value="">Alcohol Requirements</option>
          <option value="Beer">Beer</option>
          <option value="Liquor">Liquor</option>
          <option value="Clear Liquor">Clear Liquor</option>
        </select>
      </div>

      {/* Animated Type Tabs */}
      <ul className="tab-list">
        {types.map((type) => {
          const Icon = typeIcons[type];
          const [i, j] = typeGradients[type];
          const active = typeFilter === type || (type === "All" && !typeFilter);

          return (
            <li
              key={type}
              style={{ "--i": i, "--j": j }}
              className={active ? "active" : ""}
              onClick={() => setTypeFilter(type === "All" ? "" : type)}
            >
              <span className="icon">
                <Icon />
              </span>
              <span className="title">{type}</span>
            </li>
          );
        })}
      </ul>

      {/* Tipsy Rating Filter */}
      <div
        className="flex items-center gap-3 justify-center mx-auto px-4 py-2 rounded-full max-w-md mt-4"
        style={{
          background: "linear-gradient(90deg, #6B0899, #F4761B)"
        }}
      >
        <span className="text-white font-semibold text-sm">Tipsy Rating:</span>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={tipsyRatingFilter || 1}
          onChange={(e) => setTipsyRatingFilter(Number(e.target.value))}
          className="w-32 h-2 rounded-full accent-white"
        />
        <span className="text-white font-semibold text-sm">
          {tipsyRatingFilter || 1}
        </span>
        <button
          onClick={() => setTipsyRatingFilter("")}
          className="px-2 py-1 rounded-full border border-white bg-white/30 text-white text-sm hover:bg-white/50 transition"
        >
          x
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
        {currentGames
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((game) => {
            const IconComponent = typeIcons[game.type];
            const baseColor = typeGradients[game.type]?.[0] || "#9ca3af";

            return (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="relative border rounded-2xl p-6 flex flex-col justify-between bg-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg group"
                style={{
                  transition: "background-color 0.4s ease, transform 0.2s ease",
                }}
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
                      style={{
                        backgroundColor: baseColor,
                        transition: "background-color 0.4s ease",
                      }}
                    >
                      <IconComponent />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-full text-white font-semibold transition bg-[#6B0899] hover:bg-purple-500"

            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="flex items-center px-3 py-2 text-white font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-full text-white font-semibold transition bg-[#6B0899] hover:bg-purple-500"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
