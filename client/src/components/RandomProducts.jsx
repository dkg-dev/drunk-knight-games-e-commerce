import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabaseClient";

export default function RandomProducts() {
  const [randomProducts, setRandomProducts] = useState([]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      const shuffled = data.sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 3));
    };

    fetchRandomProducts();
  }, []);

  if (!randomProducts.length)
    return <p className="text-center py-10">Loading products...</p>;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-[#6B0899]">Featured Products</h2>
        <p className="text-gray-600 mb-10">
          Discover some exciting games we think you'll love.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {randomProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-6 text-left flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-[#6B0899]">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {product.description?.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </p>
                <Link
                  to={`/shop/${product.id}`}
                  className="text-[#F4761B] font-medium hover:underline mt-auto"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/shop"
            className="text-[#F4761B] font-semibold hover:underline text-lg"
          >
            See All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
