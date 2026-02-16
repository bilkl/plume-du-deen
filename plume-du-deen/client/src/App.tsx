import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundaryNew";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const ProductsPage = lazy(() => import("./pages/Products"));
const About = lazy(() => import("./pages/About"));
const Ramadan = lazy(() => import("./pages/Ramadan"));
const Invocations = lazy(() => import("./pages/Invocations"));
const Planner = lazy(() => import("./pages/Planner"));
const NomsAllah = lazy(() => import("./pages/NomsAllah"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentError = lazy(() => import("./pages/PaymentError"));
const Orders = lazy(() => import("./pages/Orders"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnsAndRefunds = lazy(() => import("./pages/ReturnsAndRefunds"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const Contact = lazy(() => import("./pages/Contact"));


function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/collection"} component={ProductsPage} />
      <Route path={"/ramadan"} component={Ramadan} />
      <Route path={"/apropos"} component={About} />
      <Route path={"/invocations"} component={Invocations} />
      <Route path={"/planner"} component={Planner} />
      <Route path={"/99noms"} component={NomsAllah} />
      <Route path={"/panier"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/paiement-succes"} component={PaymentSuccess} />
      <Route path={"/paiement-erreur"} component={PaymentError} />
      <Route path={"/commandes"} component={Orders} />
      <Route path={"/creer-compte"} component={CreateAccount} />
      <Route path={"/conditions-generales"} component={TermsAndConditions} />
      <Route path={"/politique-confidentialite"} component={PrivacyPolicy} />
      <Route path={"/retours-remboursements"} component={ReturnsAndRefunds} />
      <Route path={"/mentions-legales"} component={LegalNotice} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <Router />
            </Suspense>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
