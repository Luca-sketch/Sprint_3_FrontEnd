// Página de verificação de compras que o usuario possui.
// Também permite a exclusão e gerar o boleto além de permitir deslogar e redirecionar para atualizar o cep
//
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import './usuario.css';

const Usuarios = ({ handleLogout }) => {
    const [compras, setCompras] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        // Verifica se o usuario está logado
        const checkLogin = async () => {
            try {
                const response = await fetch('http://localhost:5000/check_login', {
                    method: 'GET',
                    headers: {
                        'x-api-key': config.API_KEY,
                    },
                    credentials: 'include'
                });
                // Caso esteja logado atualiza o valor
                if (response.ok) {
                    setIsLoggedIn(true);
                    fetchCompras();
                    fetchProdutos();
                } else {
                    setIsLoggedIn(false);
                    alert('Você precisa estar logado para acessar esta página.');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Erro ao verificar login:', error);
                setIsLoggedIn(false);
                alert('Você precisa estar logado para acessar esta página.');
                navigate('/login');
            }
        };
        // Verifica as compras que o usuario tem 
        const fetchCompras = async () => {
            try {
                const response = await fetch('http://localhost:5000/ver_compras', {
                    method: 'GET',
                    headers: {
                        'x-api-key': config.API_KEY,
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompras(data);
                } else {
                    console.error('Erro ao buscar compras:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
            }
        };
        const fetchProdutos = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/products');
                const data = await response.json();
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };
        checkLogin();
    }, [navigate]);

    const getProdutoImagem = (produtoNome) => {
        const produto = produtos.find(prod => prod.title === produtoNome);
        return produto ? produto.image : '';
    };

    // Chama a rota de deletar uma compra passando o ID
    const handleDelete = async (compraId) => {
        const formData = new FormData();
        formData.append('compra_id', compraId);

        try {
            const response = await fetch('http://localhost:5000/deletar_compra', {
                method: 'DELETE',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                alert('Compra deletada com sucesso!');
                setCompras(compras.filter(compra => compra.id !== compraId));
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`Erro ao deletar compra: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };

    // Chama a rota gerar PDF passando o ID
    const handleGeneratePDF = async (compraId) => {
        const formData = new FormData();
        formData.append('compra_id', compraId);

        try {
            const response = await fetch('http://localhost:5000/gerar_pdf', {
                method: 'POST',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `compra_${compraId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                const errorData = await response.json();
                console.error(errorData);
                alert(`Erro ao gerar PDF: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };
    
    // Rota para deslogar  
    const handleLogoutClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'GET',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/login');
                window.location.reload(false);
            } else {
                console.error('Erro ao realizar logout:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    };

    return (
        <div className="usuario-container">
            <div className="button-group">
                <h2>Minhas Compras</h2>
                <button onClick={handleLogoutClick} className="logout-button">Logout</button>
                <button><Link to="/atualizar" className="atualizar-button">Atualizar CEP</Link></button>
            </div>
            {compras.length === 0 ? (
                <p>Você não tem compras registradas.</p>
            ) : (
                <div className="compras-list">
                    {compras.map((compra) => (
                        <div key={compra.id} className="compra-item">
                            <img src={getProdutoImagem(compra.Produto)} alt={compra.Produto} className="compra-image" />
                            <div className="compra-details">
                                <h4>{compra.Produto}</h4>
                                <p>{compra.Valor}</p>
                                <p>{compra.Onda}</p>
                            </div>
                            <button onClick={() => handleDelete(compra.id)}>Deletar Compra</button>
                            <button onClick={() => handleGeneratePDF(compra.id)}>Gerar PDF</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Usuarios;
