// Página para efetuar o login
//
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link,useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

    // Chamada da rota login passando o email e a senha no formato formdata
    const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('Email', data.Email);
    formData.append('Senha', data.Senha);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        body: formData,
        credentials: 'include', 
      });

      if (response.ok) {
        const usuario = await response.json();
        alert('Login realizado com sucesso!');
        navigate('/products');
        window.location.reload(false);
      } else if (response.status === 401) {
        alert('Email ou senha incorretos.');
      } else {
        alert('Erro ao tentar logar.');
      }
    } catch (error) {
      alert('Erro na requisição: ' + error.message);
    }
  };

  return (
    <div className="login-container">
        <h2>Login de Usuário</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Email</label>
                <input 
                    type="email" 
                    {...register('Email', { required: 'Email é obrigatório' })} 
                />
                {errors.Email && <p>{errors.Email.message}</p>}
            </div>
            <div>
                <label>Senha</label>
                <input 
                    type="password" 
                    {...register('Senha', { required: 'Senha é obrigatória' })} 
                />
                {errors.Senha && <p>{errors.Senha.message}</p>}
            </div>
            <button type="submit">Logar</button>
            <button className="register-button">
                <Link to="/usuario">Cadastrar</Link>
            </button>
        </form>
    </div>
);
};

export default Login;

