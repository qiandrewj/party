import { createBrowserRouter } from "react-router";
import { InputPage } from "./pages/Input";
import { LoadingPage } from "./pages/LoadingPage";
import { OutputPage } from "./pages/OutputPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: InputPage,
  },
  {
    path: "/loading",
    Component: LoadingPage,
  },
  {
    path: "/output",
    Component: OutputPage,
  },
]);
