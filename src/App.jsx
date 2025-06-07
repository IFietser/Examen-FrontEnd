import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/css/App.css";
//IMPORT COMPONENTS
import Footer from "./components/Footer";
//IMPORT PAGES
import Licitaciones from "./components/pages/Licitaciones";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<h1>Hola mundo</h1>} />
          <Route path="/licitaciones" element={<Licitaciones />} />
        </Routes>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;
