import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RetailerItems = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/customer/items/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: parseFloat(value) || 0 },
    }));
  };

  const handleAddToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: prev[item._id]?.quantity || 1,
      },
    }));
  };

  const goToCart = () => {
    const cartItems = Object.values(cart).filter((item) => item.quantity > 0);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.setItem("retailer_id", id);
    navigate("/cart");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">Available Items</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md p-5 border border-gray-100"
          >
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p>Unit: {item.unit}</p>
            <p>Price: ₹{item.price}</p>
            <p>
              Available: {item.quantity_available - item.sold_today} {item.unit}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Quantity"
                className="border p-2 w-24 rounded-md"
                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
              />
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={goToCart}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700"
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default RetailerItems;
