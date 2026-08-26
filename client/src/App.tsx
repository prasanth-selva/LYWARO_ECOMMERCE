// Blacktop Editorial: routes share one chrome and one commerce state so the site feels like a single studio, not disconnected pages.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./contexts/StoreContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/shop" component={Shop} /><Route path="/product/:id" component={Product} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><StoreProvider><TooltipProvider><Toaster /><Router /></TooltipProvider></StoreProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
