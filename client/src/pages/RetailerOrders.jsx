import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import moment from "moment";

const RetailerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/retailer/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const markReady = async (orderId) => {
    try {
      await axios.post(`/retailer/order/${orderId}/ready`);
      fetchOrders();
    } catch (err) {
      alert("Failed to mark order as ready");
    }
  };

  const markCompleted = async (orderId) => {
    try {
      await axios.post(`/retailer/order/${orderId}/complete`);
      fetchOrders();
    } catch (err) {
      alert("Failed to mark order as completed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 border rounded bg-gray-100 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    <strong>Order #{order.order_number}</strong> •{" "}
                    <span className="text-sm">
                      {moment(order.created_at).fromNow()}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="uppercase">{order.status}</span>
                  </p>
                  <p>
                    <span className="font-medium">Total:</span> ₹
                    {order.total_amount}
                  </p>
                  <p>
                    <span className="font-medium">Payment Mode:</span>{" "}
                    {order.payment_mode}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium">Items:</p>
                <ul className="ml-4 list-disc text-sm">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.name} - {item.quantity} {item.unit} @ ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 mt-2">
                {order.status === "Pending" && (
                  <button
                    onClick={() => markReady(order._id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    Mark as Ready
                  </button>
                )}
                {order.status === "Ready for Pickup" && (
                  <button
                    onClick={() => markCompleted(order._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RetailerOrders;
