import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Business from "./pages/Business";
import Community from "./pages/Community";
import Events from "./pages/Events";
import Scholarships from "./pages/Scholarships";
import AdminDashboard from "./pages/AdminDashboard";
import SMEDashboard from "./pages/SMEDashboard";
import Profile from "./pages/Profile";
import { useAuth } from "./_core/hooks/useAuth";
import { GlobalAIChatBox } from "./components/GlobalAIChatBox";

function Router() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:slug" component={CourseDetail} />
      <Route path="/business" component={Business} />
      <Route path="/community" component={Community} />
      <Route path="/events" component={Events} />
      <Route path="/scholarships" component={Scholarships} />
      <Route path="/profile" component={Profile} />
      {user?.role === 'admin' && <Route path="/admin" component={AdminDashboard} />}
      {(user?.role === 'sme' || user?.role === 'admin') && <Route path="/sme" component={SMEDashboard} />}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Router />
          <GlobalAIChatBox />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
