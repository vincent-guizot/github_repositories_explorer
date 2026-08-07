import { RouterProvider } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
