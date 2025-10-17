import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import supabase from "../supabaseClient";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const { addToCart } = useCart();

  const rightSideRef = useRef(null);
  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    const fetchProductAndImages = async () => {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("Products")
        .select("*")
        .eq("id", id)
        .single();

      setProduct(productData);

      // Fetch related images
      const { data: imgData } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id);

      const imagesWithUrls = (imgData || []).map((img) => {
        let publicUrl = img.image_url;

        if (!img.image_url.startsWith("http")) {
          const { data: publicUrlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(img.image_url);
          publicUrl = publicUrlData.publicUrl;
        }

        return { ...img, publicUrl };
      });

      setImages(imagesWithUrls);

      if (imagesWithUrls.length > 0) {
        const defaultMain =
          imagesWithUrls.find((img) => img.is_main) || imagesWithUrls[0];
        setMainImage(defaultMain);
      }
    };

    fetchProductAndImages();
  }, [id]);

  // Update image height whenever right side changes
  useEffect(() => {
    if (rightSideRef.current) {
      setImageHeight(rightSideRef.current.offsetHeight);
    }
  }, [product, images]);

  if (!product) return <p className="p-10 text-center">Loading product...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Main Image */}
        <div className="flex-1">
          {mainImage ? (
            <img
              src={mainImage.publicUrl}
              alt={product.name}
              className="w-full object-contain rounded-xl shadow-md"
              style={{ height: imageHeight ? `${imageHeight}px` : "auto" }}
            />
          ) : (
            <div
              className="w-full bg-gray-200 flex items-center justify-center rounded-xl"
              style={{ height: imageHeight ? `${imageHeight}px` : "300px" }}
            >
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Right side: Product details */}
        <div
          className="flex-1 flex flex-col justify-between"
          ref={rightSideRef}
        >
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold mb-6">
              €{product.price?.toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="text-white hover:text-purple-600 hover:border-purple-600 font-semibold py-3 px-6 rounded-full w-full transition border-2 border-gray-200"
            style={{
                background: "linear-gradient(90deg, #b888ef, #f8b286)",
              }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-4 mt-10">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.publicUrl}
            alt={product.name}
            onClick={() => setMainImage(img)}
            className={`w-32 h-32 object-cover rounded-lg cursor-pointer border-2 ${
              mainImage?.id === img.id
                ? "border-purple-500"
                : "border-transparent hover:border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
