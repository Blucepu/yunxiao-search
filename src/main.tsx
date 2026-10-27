import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ToastProvider } from "@/components/ui/toast"
import Router from "./router"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <Router />
    </ToastProvider>
  </StrictMode>
)
