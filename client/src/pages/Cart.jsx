import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("on-pickup");
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  }, []);

  const updateQuantity = (index, quantity) => {
    const updated = [...cartItems];
    updated[index].quantity = parseFloat(quantity);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handlePrepaidPayment = async () => {
    const token = localStorage.getItem("token");
    const retailer_id = localStorage.getItem("retailer_id");

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const paymentRes = await axios.post(
        "http://localhost:8000/create-razorpay-order",
        { amount: totalAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order_id, razorpay_key_id, currency } = paymentRes.data;

      const options = {
        key: razorpay_key_id,
        amount: totalAmount * 100,
        currency,
        name: "Local Store",
        description: "Prepaid Order",
        order_id,
        handler: async function (response) {
          const items = cartItems.map((item) => ({
            item_id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            unit: item.unit,
          }));

          await axios.post(
            "http://localhost:8000/customer/place-order",
            {
              retailer_id,
              items,
              payment_mode: "prepaid",
              customer_phone: phone,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("✅ Order placed successfully!");
          localStorage.removeItem("cart");
          localStorage.removeItem("retailer_id");
          navigate("/dashboard");
        },
        prefill: {
          contact: phone,
        },
        theme: {
          color: "#4EA685",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      alert("❌ Payment failed. Try again.");
    }
  };

  const placeOrder = async () => {
    if (!phone || phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
      alert("❌ Please enter a valid 10-digit mobile number.");
      return;
    }

    if (paymentMode === "prepaid") {
      handlePrepaidPayment();
      return;
    }

    const retailer_id = localStorage.getItem("retailer_id");
    const token = localStorage.getItem("token");

    const items = cartItems.map((item) => ({
      item_id: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      unit: item.unit,
    }));

    try {
      await axios.post(
        "http://localhost:8000/customer/place-order",
        {
          retailer_id,
          items,
          payment_mode: "on-pickup",
          customer_phone: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      localStorage.removeItem("retailer_id");
      navigate("/dashboard");
    } catch (err) {
      alert(
        "❌ Error placing order: " + (err.response?.data?.detail || err.message)
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center text-xl">
        Your cart is empty. Go to a retailer and add items!
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="text-left border-b">
            <th>Item</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td>{item.name}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  className="border rounded px-2 w-20"
                  onChange={(e) => updateQuantity(idx, e.target.value)}
                />
              </td>
              <td>{item.unit}</td>
              <td>₹{item.price}</td>
              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-lg font-semibold mb-2">
        Total Amount: ₹
        {cartItems
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toFixed(2)}
      </p>

      <div className="mb-3">
        <label className="block font-semibold">Mobile Number:</label>
        <input
          type="tel"
          className="border rounded w-full p-2 mt-1"
          placeholder="Enter phone number for SMS updates"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Payment Mode:</label>
        <select
          className="border rounded w-full p-2 mt-1"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="on-pickup">Pay on Pickup</option>
          <option value="prepaid">Prepaid</option>
        </select>
      </div>

      <button
        onClick={placeOrder}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg"
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;
