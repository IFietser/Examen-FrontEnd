import { BrowserRouter, Routes, Route } from "react-router-dom";
//IMPORT CSS
import "./components/css/App.css";
//IMPORT COMPONENTS
import Footer from "./components/Footer";
//IMPORT PAGES
import Licitaciones from "./components/pages/Licitaciones";
//IMPORT NAVBAR
import Navbar from "./components/Navbar";
//IMPORT CONTAINER
import Container from "react-bootstrap/Container";

function App() {
  return (
    <BrowserRouter>
      <>
        <Navbar />
        <Container className="talleres-container d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Routes>
          <Route path="/" element={<h1>Hola mundo</h1>} />
          <Route path="/Licitaciones" element={<Licitaciones />} />
        </Routes>
        </Container>
        <Footer />
      </>
    </BrowserRouter>
  );
}

export default App;
