import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store.tsx";
import CartPage from "./pages/CartPage.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ShippingAddressPage from "./pages/ShippingAddressPage.tsx";
import PaymentMethodPage from "./pages/PaymentMethodPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Nv2KIL4EXhnCoIc9pET7UvF4630qV8GSflLkNcI87C6ixMeGYzulef888GKBbtruj5KPHblHt4FHIZzN4ipxQki00VMAkzGAS"
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="signin/" element={<SigninPage />} />
      <Route path="signup/" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/orderhistory" element={<OrderHistoryPage />} />
        <Route path="/category/:category" element={<CategoryPage />}></Route>
      </Route>
    </Route>
  )
);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <Elements stripe={stripePromise}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Elements>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
