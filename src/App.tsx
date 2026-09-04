
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";
import TodayPage from "./pages/TodayPage";
import ListsPage from "./pages/ListsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
// import ConfirmEmailPage from "./pages/ConfirmEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<TodayPage />} />
               <Route path="/lists" element={<ListsPage />} />
               <Route path="/room/:roomId" element={<RoomDetailPage />} />
               <Route path="/settings" element={<SettingsPage />} />
               <Route path="/auth" element={<AuthPage />} />
              {/*
              <Route path="/confirm-email" element={<ConfirmEmailPage />} />
              */}
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
