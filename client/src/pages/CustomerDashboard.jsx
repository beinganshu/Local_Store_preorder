import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center h-screen overflow-y-auto">
      <h1 className="text-3xl font-semibold mb-6">Customer Dashboard</h1>

      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={() => navigate("/auth/retailers")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          🛒 Buy Items
        </button>

        <button
          onClick={() => navigate("/customer/orders")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          📦 View My Orders
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
