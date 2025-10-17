import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text = "", color = "text-yellow-500" }) => {
  // Ensure value is between 0 and 5
  const rating = Math.min(Math.max(value, 0), 5);

  const fullStars = Math.floor(rating);
  const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className={`${color} ml-1`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`${color} ml-1`} />}

      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className={`${color} ml-1`} />
      ))}

      {text && <span className="ml-2 text-gray-700">{text}</span>}
    </div>
  );
};

export default Ratings;
