import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import SmoothScroll from "./components/SmoothScroll";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./contexts/StoreContext";
import { AuthProvider } from "./contexts/AuthContext";

// Core pages (loaded immediately)
import Home from "./pages/Home";

// Lazy-loaded pages (code-split into separate chunks)
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#EAE8E1]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#111211] border-t-transparent" />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#111211]/40">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/product/:id" component={Product} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/:id" component={Orders} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <StoreProvider>
            <SmoothScroll>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </SmoothScroll>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
