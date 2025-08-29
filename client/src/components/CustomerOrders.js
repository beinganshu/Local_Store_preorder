import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/customer/orders");
        setOrders(res.data);
      } catch (err) {
        alert("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, []);

  if (orders.length === 0) return <p>No orders placed yet.</p>;

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid gray", margin: "1em", padding: "1em" }}
        >
          <p>
            <strong>Order No:</strong> {order.order_number}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Total:</strong> ₹{order.total_amount}
          </p>
          <p>
            <strong>Payment:</strong> {order.payment_mode}
          </p>
          <p>
            <strong>Items:</strong>
          </p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} — {item.quantity} {item.unit} × ₹{item.price} = ₹
                {(item.quantity * item.price).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CustomerOrders;
