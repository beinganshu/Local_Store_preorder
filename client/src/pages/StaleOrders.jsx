import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const StaleOrders = () => {
  const [staleOrders, setStaleOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaleOrders = async () => {
    try {
      const res = await axios.get("/retailer/stale-orders");
      setStaleOrders(res.data);
    } catch (error) {
      console.error("Error fetching stale orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaleOrders();
  }, []);

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        ⏳ Stale Orders (Pending > 2hrs)
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : staleOrders.length === 0 ? (
        <p>No stale orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Order #</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {staleOrders.map((order) => (
                <tr key={order._id} className="border">
                  <td className="px-4 py-2 border">{order.order_number}</td>
                  <td className="px-4 py-2 border">{order.customer_phone}</td>
                  <td className="px-4 py-2 border">
                    <ul className="list-disc ml-4 text-sm">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} - {item.quantity} {item.unit}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border">₹ {order.total_amount}</td>
                  <td className="px-4 py-2 border">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaleOrders;
