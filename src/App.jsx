import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { BookingProvider } from "./context/BookingContext";
import Booking from "./pages/Booking";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}
