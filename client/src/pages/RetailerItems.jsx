import React, { useEffect, useState } from "react";
import axios from "../utils/axios";

const RetailerItems = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    unit: "",
    price: "",
    quantity_available: "",
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get("/retailer/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    try {
      await axios.post("/retailer/items", {
        ...newItem,
        price: parseFloat(newItem.price),
        quantity_available: parseFloat(newItem.quantity_available),
      });
      setNewItem({ name: "", unit: "", price: "", quantity_available: "" });
      fetchItems();
    } catch (err) {
      console.error("Add item error:", err.response?.data || err.message);
      alert("Failed to add item");
    }
  };

  const handleRestock = async (itemId) => {
    const quantity = prompt("Enter new quantity:");
    if (!quantity || isNaN(quantity)) return;
    try {
      await axios.post(`/retailer/items/restock/${itemId}`, {
        quantity: parseFloat(quantity),
      });
      fetchItems();
    } catch (err) {
      alert("Failed to restock");
    }
  };

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Manage My Items</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Item</h3>
        <div className="flex flex-col gap-2 w-80">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Unit (kg, packet, etc)"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border p-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.quantity_available}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity_available: e.target.value })
            }
            className="border p-2"
          />
          <button
            onClick={handleAddItem}
            className="bg-green-600 text-white p-2 rounded"
          >
            Add Item
          </button>
        </div>
      </div>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-3">Your Items</h3>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded bg-gray-100 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>{item.name}</strong> ({item.unit}) - ₹{item.price}
              </p>
              <p>
                Available: {item.quantity_available}, Sold Today:{" "}
                {item.sold_today}
              </p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded"
              onClick={() => handleRestock(item._id)}
            >
              Restock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetailerItems;
