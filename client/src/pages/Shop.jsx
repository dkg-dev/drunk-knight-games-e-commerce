import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabaseClient";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [playerFilter, setPlayerFilter] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    const { min_players, max_players } = product;
    const players = playerFilter === "All" ? true : (() => {
      const selected = parseInt(playerFilter);
      if (playerFilter === "4+") return (min_players >= 4 || max_players >= 4);
      return (
        (min_players && min_players <= selected && (!max_players || max_players >= selected)) ||
        (max_players && max_players === selected)
      );
    })();

    return matchesSearch && matchesCategory && players;
  });

  const renderPlayers = (product) => {
    const { min_players, max_players } = product;
    if (min_players && max_players && min_players !== max_players) {
      return `Players: ${min_players} - ${max_players}`;
    }
    if (min_players) {
      return `Players: ${min_players}+`;
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#6B0899] mb-2">
          Shop Board Games
        </h1>
        <p className="text-gray-600">
          Discover creative, chaotic, and unforgettable party games.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-10 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-lg w-full sm:w-1/3 text-gray-700 border-1 border-purple-600  focus:outline-none focus:ring-2 focus:ring-[#F4761B] "
        />

        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border-1 border-purple-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4761B]"
          >
            <option value="All">All Categories</option>
            <option value="Party">Party</option>
            <option value="Strategy">Strategy</option>
            <option value="Card">Card</option>
            <option value="Trivia">Trivia</option>
          </select>

          <select
            value={playerFilter}
            onChange={(e) => setPlayerFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border-1 border-purple-600 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F4761B]"
          >
            <option value="All">All Players</option>
            <option value="1">1 Player</option>
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4+">4+ Players</option>
          </select>
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500 animate-pulse">
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No products found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/shop/${product.id}`}
              className=" rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
              style={{
                background: "linear-gradient(90deg, #b888ef, #f8b286)"
              }}
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="px-3 py-1 flex flex-col flex-grow text-left">
                <h2 className="text-lg font-semibold text-white">
                  {product.name}
                </h2>

                {/* Players info */}
                {renderPlayers(product) && (
                  <p className="text-sm text-gray-50">
                    {renderPlayers(product)}
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-black bg-white rounded-full px-2 border-1 border-amber-600">
                    €{product.price}
                  </span>
                  <span className="text-sm text-gray-400">
                    {product.category || "Misc"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
