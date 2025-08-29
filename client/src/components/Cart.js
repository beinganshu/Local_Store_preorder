import React, { useState } from "react";
import axios from "axios";

const Cart = ({ cartItems, retailerId, clearCart }) => {
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("Pay on Pickup");

  const placeOrder = async () => {
    if (!phone || cartItems.length === 0) {
      alert("Enter phone and add at least one item.");
      return;
    }

    const orderPayload = {
      retailer_id: retailerId,
      customer_phone: phone,
      payment_mode: paymentMode,
      items: cartItems.map((i) => ({
        item_id: i._id,
        name: i.name,
        unit: i.unit,
        price: i.price,
        quantity: i.quantity,
      })),
    };

    try {
      const res = await axios.post("/api/customer/place-order", orderPayload);
      alert("Order Placed! Order ID: " + res.data.order_id);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.detail || "Error placing order");
    }
  };

  return (
    <div>
      <h3>Your Cart</h3>
      {cartItems.map((item) => (
        <div key={item._id}>
          {item.name} — {item.quantity} {item.unit}
        </div>
      ))}
      <input
        type="text"
        placeholder="Phone for SMS updates"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <select
        value={paymentMode}
        onChange={(e) => setPaymentMode(e.target.value)}
      >
        <option>Pay on Pickup</option>
        <option>Prepaid</option>
      </select>
      <br />
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;
