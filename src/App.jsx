import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import CartModal from "./components/CartModal/CartModal";

function App() {
  const [ isCartOpen, setIsCartOpen ] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">

        <Sidebar onOpenCart={()=> setIsCartOpen(true)}/>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </main>

        {isCartOpen &&(
          <CartModal onClose={() => setIsCartOpen(false)} />
        )}

      </div>
    </BrowserRouter>
  );
}

export default App;