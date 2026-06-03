import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Orders from "./pages/Orders/Orders";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>

      <div className="app">

        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <main className="content">
          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/menu"
              element={<Menu />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/pedidos"
              element={<Orders />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;