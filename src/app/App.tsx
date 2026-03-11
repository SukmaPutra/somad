// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/core/context/AuthProvider";
import { AppRoutes } from "@/app/routes";
import { ThemeProvider } from "@/core/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
