import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "@clerk/clerk-react";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import MessagesPage from "./pages/MessagesPage";
import CustomersPage from "./pages/CustomersPage";
import DashboardLayout from "./layouts/DashboardLayout";
import PageLoader from "./components/PageLoader";

function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <PageLoader />;

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isSignedIn && isAdmin ? <Navigate to="/dashboard" /> : <LoginPage />
        }
      />

      <Route
        path="/"
        element={
          !isSignedIn ? (
            <Navigate to="/login" />
          ) : !isAdmin ? (
            <Navigate to="/login?error=unauthorized" />
          ) : (
            <DashboardLayout />
          )
        }
      >
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="messages" element={<MessagesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
