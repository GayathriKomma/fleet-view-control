
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { ShipsProvider } from "./contexts/ShipsContext";
import { ComponentsProvider } from "./contexts/ComponentsContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { JobsProvider } from "./contexts/JobsContext";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import ShipDetailPage from "./pages/ShipDetailPage";
import JobsPage from "./pages/JobsPage";
import CalendarPage from "./pages/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ShipsProvider>
              <ComponentsProvider>
                <NotificationProvider>
                  <JobsProvider>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="ships" element={<ShipsPage />} />
                        <Route path="ships/:id" element={<ShipDetailPage />} />
                        <Route path="jobs" element={<JobsPage />} />
                        <Route path="calendar" element={<CalendarPage />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </JobsProvider>
                </NotificationProvider>
              </ComponentsProvider>
            </ShipsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
