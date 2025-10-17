import React, { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../Redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../Components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
  productId, // <- use this
}) => {
  const { data: topProducts, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (!product) return <p>Loading product...</p>;
  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Tabs */}
      <section className="flex flex-col md:flex-row md:flex-wrap md:w-48">
        <div
          className={`p-4 cursor-pointer text-lg ${activeTab === 1 ? "font-bold text-pink-600" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          Write Your Review
        </div>
        <div
          className={`p-4 cursor-pointer text-lg ${activeTab === 2 ? "font-bold text-pink-600" : ""}`}
          onClick={() => setActiveTab(2)}
        >
          All Reviews
        </div>
        <div
          className={`p-4 cursor-pointer text-lg ${activeTab === 3 ? "font-bold text-pink-600" : ""}`}
          onClick={() => setActiveTab(3)}
        >
          Related Products
        </div>
      </section>

      {/* Tab Content */}
      <section className="flex-1">
        {/* Write Review */}
        {activeTab === 1 && (
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2 font-semibold">Rating</label>
                  <select
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="p-2 border rounded-lg w-full text-black"
                  >
                    <option value="">Select</option>
                    <option value={1}>Inferior</option>
                    <option value={2}>Decent</option>
                    <option value={3}>Great</option>
                    <option value={4}>Excellent</option>
                    <option value={5}>Exceptional</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Comment</label>
                  <textarea
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                    placeholder="Write your review..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login" className="text-pink-600">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="mt-4 space-y-4">
            {(!product.reviews || product.reviews.length === 0) ? (
              <p>No Reviews Yet</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <strong>{review.name}</strong>
                    <span className="text-sm text-gray-500">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {(!topProducts || topProducts.length === 0) ? (
              <p>No related products</p>
            ) : (
              topProducts.map((p) => <SmallProduct key={p._id} product={p} />)
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
