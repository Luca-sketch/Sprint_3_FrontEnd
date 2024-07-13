// Lida com as páginas
//
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Login from './pages/login/logins';
import Products from './pages/product/product';
import Usuario from './pages/cadastro/cadastro';
import { CartProvider } from './CartContext';
import AtualizarCEP from './pages/atualizarcep/atualizarcep';
import Usuarios from './pages/usuarios/usuarios'
import './App.css';

const App = () => {
    return (
        <CartProvider>
            <div className="footer-container">
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/usuario" element={<Usuario/>} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/atualizar" element={<AtualizarCEP/>}/>
                        <Route path="/usuarios" element={<Usuarios/>}/>
                    </Routes>
                </Router>
                <Footer />
            </div>
        </CartProvider>
    );
};

export default App;


