// src/pages/RetailerSelection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RetailerSelection = () => {
  const [retailers, setRetailers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/auth/retailers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRetailers(res.data);
      } catch (err) {
        console.error("Error fetching retailers:", err);
      }
    };

    fetchRetailers();
  }, []);

  const goToRetailer = (id) => {
    navigate(`/retailers/${id}/items`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Choose a Retailer</h2>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {retailers.map((retailer) => (
          <div
            key={retailer._id}
            className="bg-white rounded-xl shadow-md p-6 hover:bg-green-50 cursor-pointer transition"
            onClick={() => goToRetailer(retailer._id)}
          >
            <h3 className="text-xl font-semibold">{retailer.name}</h3>
            <p className="text-gray-500">{retailer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetailerSelection;
