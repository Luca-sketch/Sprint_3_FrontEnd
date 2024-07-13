import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../CartContext';
import './cart.css';
import config from '../../config';

const Cart = ({ closeCart }) => {
    const { cartItems, removeFromCart } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await fetch('http://localhost:5000/check_login', {
                    method: 'GET',
                    headers: {
                        'x-api-key': config.API_KEY,
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Erro ao verificar login:', error);
                setIsLoggedIn(false);
            }
        };

        checkLogin();
    }, []);

    const handleBuy = async () => {
        if (!isLoggedIn) {
            alert('Você precisa estar logado para realizar uma compra.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        cartItems.forEach((item, index) => {
            formData.append(`Produto`, item.title);
            formData.append(`Valor`, item.price);
            formData.append(`Onda`, new Date().toISOString()); 
        });

        
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }

        try {
            const response = await fetch('http://localhost:5000/carrinho', {
                method: 'POST',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                alert('Compra realizada com sucesso!');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`Erro ao realizar compra: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };

    return (
        <div className="cart-overlay">
            <div className="cart">
                <div className="cart-header">
                    <h2 className="cart-title">Carrinho</h2>
                    <button className="close-cart" onClick={closeCart}>X</button>  
                </div>
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>Seu carrinho está vazio</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h4>{item.title}</h4>
                                    <p>{item.price}</p>
                                </div>
                                <button className="remove-item" onClick={() => removeFromCart(index)}>🗑️</button>
                            </div>
                        ))
                    )}
                </div>
                {cartItems.length > 0 && (
                    <button className="buy-button" onClick={handleBuy}>Comprar</button>
                )}
            </div>
        </div>
    );
};

export default Cart;




