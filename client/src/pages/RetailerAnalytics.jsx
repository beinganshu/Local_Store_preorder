import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const RetailerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/retailer/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>

      {!analytics ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
            <p className="text-sm">Weekly Sales</p>
            <h3 className="text-xl font-bold">₹ {analytics.weekly_sales}</h3>
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded shadow">
            <p className="text-sm">Monthly Sales</p>
            <h3 className="text-xl font-bold">₹ {analytics.monthly_sales}</h3>
          </div>

          <div className="bg-purple-100 text-purple-800 p-4 rounded shadow">
            <p className="text-sm">Completed Orders</p>
            <h3 className="text-xl font-bold">{analytics.completed_orders}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailerAnalytics;
