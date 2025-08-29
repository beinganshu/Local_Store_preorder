import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/customer/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/customer/cancel-order/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await axios.get("http://localhost:8000/customer/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to cancel order", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  Order #{order.order_number}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    order.status === "Pending"
                      ? "bg-yellow-300"
                      : order.status === "Ready for Pickup"
                      ? "bg-blue-300"
                      : order.status === "Completed"
                      ? "bg-green-300"
                      : "bg-red-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Payment Mode:</strong> {order.payment_mode}
              </div>

              <ul className="text-sm list-disc pl-5 mb-2">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — {item.quantity} {item.unit} @ ₹{item.price}
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-700">
                <strong>Total:</strong> ₹{order.total_amount}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Ordered on{" "}
                {new Date(
                  new Date(order.created_at).getTime() + 5.5 * 60 * 60 * 1000
                ).toLocaleString("en-IN")}
              </div>
              {order.status === "Pending" && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
