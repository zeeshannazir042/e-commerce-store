import React from "react";
import { useSelector } from "react-redux";

const CartCount = () => {
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (totalQty === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
      {totalQty}
    </span>
  );
};

export default CartCount;
