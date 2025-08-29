import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemCatalog = ({ addToCart }) => {
  const { retailerId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get(`/api/items/retailer/${retailerId}`);
      setItems(res.data);
    };
    fetchItems();
  }, [retailerId]);

  return (
    <div>
      <h2>Available Items</h2>
      {items.map((item) => {
        const available = item.quantity_available - item.sold_today;
        return (
          <div
            key={item._id}
            style={{ border: "1px solid #ccc", margin: "1em", padding: "1em" }}
          >
            <strong>{item.name}</strong> — ₹{item.price} / {item.unit} <br />
            Available: {available}
            <br />
            <input
              type="number"
              min={0}
              max={available}
              placeholder="Qty"
              onChange={(e) => {
                const qty = parseFloat(e.target.value);
                if (qty > available) {
                  alert(`Only ${available} available`);
                  return;
                }
                addToCart(item, qty);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ItemCatalog;
