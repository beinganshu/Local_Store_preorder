import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import CustomerDashboard from "./pages/CustomerDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";
import RetailerItems from "./pages/RetailerItems";
import RetailerOrders from "./pages/RetailerOrders";
import RetailerAnalytics from "./pages/RetailerAnalytics";
import StaleOrders from "./pages/StaleOrders";
import RetailerSelection from "./pages/RetailerSelection";
import Items from "./pages/Items";
import Cart from "./pages/Cart";
import CustomerOrders from "./pages/CustomerOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />;
        <Route path="/dashboard" element={<ProtectedRoute />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
        <Route path="/retailer/items" element={<RetailerItems />} />
        <Route path="/retailer/orders" element={<RetailerOrders />} />
        <Route path="/retailer/analytics" element={<RetailerAnalytics />} />
        <Route path="/retailer/stale-orders" element={<StaleOrders />} />
        <Route path="/auth/retailers" element={<RetailerSelection />} />
        <Route path="/retailers/:id/items" element={<Items />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
