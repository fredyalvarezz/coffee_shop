import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Orders from "./pages/Orders/Orders";
import Cartera from "./pages/Cartera/Cartera";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Admin from "./pages/Admin/Admin";
import Profile from "./pages/Profile/Profile";
import { ProductsProvider } from "./context/ProductsContext";
import { CatalogProvider } from "./context/CatalogContext";
import { InventoryProvider } from "./context/InventoryContext";
import { OrdersProvider } from "./context/OrdersContext";
import { UsersProvider } from "./context/UsersContext";
import { SettingsProvider } from "./context/SettingsContext";
import { WalletProvider } from "./context/WalletContext";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">

      <ProductsProvider>
      <CatalogProvider>
      <InventoryProvider>
      <OrdersProvider>
      <UsersProvider>
      <SettingsProvider>
      <WalletProvider>

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="app__main">

        <Header />

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

            <Route
              path="/cartera"
              element={<Cartera />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/perfil"
              element={<Profile />}
            />

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Routes>
        </main>

      </div>

      </WalletProvider>
      </SettingsProvider>
      </UsersProvider>
      </OrdersProvider>
      </InventoryProvider>
      </CatalogProvider>
      </ProductsProvider>

    </div>
  );
}

export default App;