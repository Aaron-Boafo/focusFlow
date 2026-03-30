import { createRoot } from "react-dom/client"
import {BrowserRouter} from 'react-router-dom'

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/context/AuthContext"

createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
)
