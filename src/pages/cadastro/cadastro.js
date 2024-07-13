// Nessa tela é feito o cadastro de usuario
// A idéia é que caso o usuario não saiba o proprio CEP, ele possa ser obtido através da geolocalização
//
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'leaflet/dist/leaflet.css';
import './cadastro.css';
import L from 'leaflet';

const Cadastro = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [cep, setCep] = useState('');
    const [clickedPosition, setClickedPosition] = useState(null);
    const [cepValidationResult, setCepValidationResult] = useState(null);
    const mapRef = useRef(null);

    // Utilizando a biblioteca Leaflet renderiza um mapa interativo dentro do componente
    useEffect(() => {
        const map = L.map('map').setView([-22.9068, -43.1729], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // Creditando os contribuidores do OpenStreetMap
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        // Função para obter a posição (latitude e longitude) do local que foi "clicado"
        const handleMapClick = (e) => {
            setClickedPosition(e.latlng);
        };

        map.on('click', handleMapClick);
           return () => {
            map.off('click', handleMapClick);
            map.remove();
        };
    }, []); 

    // Chamada da rota cadastro passando as informações no formato formdata
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('Email', data.Email);
        formData.append('Senha', data.Senha);
        formData.append('CEP', data.CEP);

        try {
            const response = await fetch('http://localhost:5000/cadastro', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Usuário cadastrado com sucesso!');
                reset(); 
            } else if (response.status === 409) {
                alert('Email já cadastrado. Digite um email diferente.');
            } else {
                alert('Não foi possível salvar novo usuário.');
            }
        } catch (error) {
            alert('Erro na requisição: ' + error.message);
        }
    };

    // Chamada da API de CEP para validação
    const handleValidateCep = async () => {
        try {
            const response = await fetch(`http://localhost:4000/cep/${cep}`);
            if (response.ok) {
                const result = await response.json();
                setCepValidationResult(result);
                alert('CEP validado com sucesso!');
            } else {
                setCep('');
                setCepValidationResult(null);
                alert('CEP não encontrado');
            }
        } catch (error) {
            console.error('Erro ao validar CEP:', error);
            alert('Erro ao validar CEP');
        }
    };

    // Chamada da API de CEP para obtenção da númeração do cep com base nas coordenadas
    const handleGetCepWithCoordinates = async () => {
        if (!clickedPosition) {
            alert('Clique em um local no mapa para obter as coordenadas.');
            return;
        }

        const { lat, lng } = clickedPosition;
        try {
            const response = await fetch(`http://localhost:4000/buscarcep?latitude=${lat}&longitude=${lng}`);
            if (response.ok) {
                const result = await response.json();
                if (result.cep) {
                    const cepSemTraco = result.cep.replace('-', '');
                    setCep(cepSemTraco);
                    alert(`CEP encontrado: ${result.cep}`);
                } else {
                    alert('CEP não encontrado para as coordenadas fornecidas.');
                }
            } else {
                alert('Erro ao buscar CEP com coordenadas.');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP com coordenadas:', error);
            alert('Erro ao buscar CEP com coordenadas.');
        }
    };

    return (
        <div className="cadastro-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Cadastro de Usuário</h2>
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
                <div>
                    <label>CEP</label>
                    <input 
                        type="text" 
                        {...register('CEP', { required: 'CEP é obrigatório' })} 
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                    />
                    {errors.CEP && <p>{errors.CEP.message}</p>}
                </div>
                <button type="submit">Cadastrar</button>
                <button type="button" onClick={handleValidateCep}>Validar CEP</button>
                <button type="button" onClick={handleGetCepWithCoordinates}>Obter CEP com Coordenada</button>
            </form>
            <div className="map-container" id="map"></div> 
        </div>
    );
};

export default Cadastro;



