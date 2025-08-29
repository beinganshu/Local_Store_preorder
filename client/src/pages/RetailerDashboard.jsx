import React from "react";
import { useNavigate } from "react-router-dom";

const RetailerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Retailer Dashboard</h1>

      <div className="flex flex-col gap-4 items-center">
        <button
          onClick={() => navigate("/retailer/items")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-60"
        >
          📦 Manage Items
        </button>

        <button
          onClick={() => navigate("/retailer/orders")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-60"
        >
          🧾 View Orders
        </button>

        <button
          onClick={() => navigate("/retailer/analytics")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-60"
        >
          📊 View Analytics
        </button>

        <button
          onClick={() => navigate("/retailer/stale-orders")}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 w-60"
        >
          ⚠️ Stale Orders (2hr+)
        </button>
      </div>
    </div>
  );
};

export default RetailerDashboard;
