// Página de atualização de CEP
//
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import './atualizarcep.css';

const AtualizarCEP = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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

        checkLogin();
    }, [navigate]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('CEP', data.CEP);

        try {
            const response = await fetch('http://localhost:5000/atualizar_cep', {
                method: 'PUT',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                body: formData,
                credentials: 'include', 
            });

            if (response.ok) {
                alert('CEP atualizado com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao atualizar CEP: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch('http://localhost:5000/deletar_usuario', {
                method: 'DELETE',
                headers: {
                    'x-api-key': config.API_KEY,
                },
                credentials: 'include', 
            });

            if (response.ok) {
                alert('Usuário deletado com sucesso!');
            } else {
                const errorData = await response.json();
                alert(`Erro ao deletar usuário: ${errorData.message}`);
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };

    return (
        <div className="atualizarcep-container">
            <h2>Atualizações</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>CEP</label>
                    <input
                        type="text"
                        {...register('CEP', { required: 'CEP é obrigatório' })}
                    />
                    {errors.CEP && <p>{errors.CEP.message}</p>}
                </div>
                <button type="submit">Atualizar CEP</button>
            </form>
            <button
                onClick={handleDelete}
                className="delete-button"
            >
                Deletar Usuário
            </button>
        </div>
    );
};

export default AtualizarCEP;

