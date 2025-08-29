import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RetailerList = () => {
  const [retailers, setRetailers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailers = async () => {
      const res = await axios.get("/api/auth/retailers"); // Endpoint to fetch retailer users
      setRetailers(res.data);
    };
    fetchRetailers();
  }, []);

  return (
    <div>
      <h2>Select a Retailer</h2>
      <ul>
        {retailers.map((r) => (
          <li key={r._id}>
            <button onClick={() => navigate(`/buy/${r._id}`)}>
              {r.shop_name || r.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RetailerList;
