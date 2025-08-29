import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return navigate("/");
      }

      try {
        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const role = res.data.role;
        if (role === "customer") {
          navigate("/customer/dashboard");
        } else if (role === "retailer") {
          navigate("/retailer/dashboard");
        } else {
          navigate("/auth");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  return null;
};

export default ProtectedRoute;
