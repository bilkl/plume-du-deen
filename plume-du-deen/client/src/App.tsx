import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import StripeProvider from "./components/StripeProvider";
import Home from "./pages/Home";
import ProductsPage from "./pages/Products";
import About from "./pages/About";
import Ramadan from "./pages/Ramadan";
import Invocations from "./pages/Invocations";
import Planner from "./pages/Planner";
import NomsAllah from "./pages/NomsAllah";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentError from "./pages/PaymentError";
import CreateAccount from "./pages/CreateAccount";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnsAndRefunds from "./pages/ReturnsAndRefunds";
import LegalNotice from "./pages/LegalNotice";


function Router() {
  return (
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
      <Route path={"/creer-compte"} component={CreateAccount} />
      <Route path={"/conditions-generales"} component={TermsAndConditions} />
      <Route path={"/politique-confidentialite"} component={PrivacyPolicy} />
      <Route path={"/retours-remboursements"} component={ReturnsAndRefunds} />
      <Route path={"/mentions-legales"} component={LegalNotice} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        <StripeProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </StripeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
