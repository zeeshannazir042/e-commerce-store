import React from "react";
import { useGetProductsQuery } from "../../Redux/api/productApiSlice";
import Slider from "react-slick";
import Message from "../../Components/Message";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const IMAGE_BASE_URL = "http://localhost:5000/uploads";
  const { data: products, isLoading, error } = useGetProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
  };

  const productList = Array.isArray(products)
    ? products
    : products?.products || [];

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-12">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="max-w-6xl mx-auto">
          {productList.map(
            ({
              _id,
              name,
              image,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="p-4 transition-all duration-500 transform hover:scale-[1.01]"
              >
                {/* Product Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300">
                  {/* Image Section */}
                  <div className="relative h-64 sm:h-80 md:h-[28rem] w-full">
                    <img
                      src={
                        image && image !== "undefined"
                          ? image.startsWith("http")
                            ? image
                            : `${IMAGE_BASE_URL}/${encodeURIComponent(image)}`
                          : "/placeholder.png"
                      }
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                    {/* Overlay Title */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h2 className="text-2xl font-semibold">{name}</h2>
                      <p className="text-lg font-medium">€{price}</p>
                    </div>
                  </div>

                  {/* Product Info Section */}
                  <div className="p-5 bg-gray-900 text-gray-100 rounded-b-2xl flex flex-col sm:flex-row justify-between gap-6">
                    {/* Left */}
                    <div className="sm:w-1/2">
                      <p className="text-sm text-gray-300 mb-3">
                        {description?.substring(0, 120)}...
                      </p>
                      <div className="flex items-center mb-2">
                        <FaStore className="mr-2 text-yellow-400" />
                        <span>Brand: {brand || "N/A"}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <FaClock className="mr-2 text-yellow-400" />
                        <span>Added: {moment(createdAt).fromNow()}</span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="sm:w-1/2 flex flex-wrap justify-between">
                      <div className="flex items-center w-1/2 mb-2">
                        <FaStar className="mr-2 text-yellow-400" />
                        <span>Rating: {rating ? rating.toFixed(1) : "N/A"}</span>
                      </div>
                      <div className="flex items-center w-1/2 mb-2">
                        <FaStar className="mr-2 text-yellow-400" />
                        <span>Reviews: {numReviews}</span>
                      </div>
                      <div className="flex items-center w-1/2 mb-2">
                        <FaShoppingCart className="mr-2 text-yellow-400" />
                        <span>Qty: {quantity}</span>
                      </div>
                      <div className="flex items-center w-1/2 mb-2">
                        <FaBox className="mr-2 text-yellow-400" />
                        <span>In Stock: {countInStock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
