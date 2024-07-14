# Título: MODERN CLICK STORE

## Descrição

Esta aplicação faz parte do projeto Modern Click Store e representa o frontend de um E-commerce
Os produtos são obtidos a partir da Api externa [fakestore](https://fakestoreapi.com/) 

## Projeto completo

Para uma experiencia completa da aplicação é importante também ter em sua máquina rodando a [API_CEP](https://github.com/Luca-sketch/Sprint_3_API_CEP) para as validações CEP e a [API_MODERN_CLICK_STORE](https://github.com/Luca-sketch/Sprint_3_BackEnd) que é responsável pelo armazenamento das informações.

## Segurança

No arquivo config.js é possível alterar a chave utilizada nos headers das chamadas. A key utilizada no config.js desta aplicação deve ser o mesmo valor da key utilizada no config.env da [API_MODERN_CLICK_STORE](https://github.com/Luca-sketch/Sprint_3_BackEnd)

## Fluxograma

Este projeto envolve a integração da seções Front-End (React JS) com a  API externas FAKESTORE

![Fluxograma do FRONT ](https://drive.google.com/uc?export=view&id=1Q2N7eII40GpPzzVJcNUotl_NdALmwzAt)

## Instruções de Uso

Esta aplicação pode ser utilizada de duas maneiras diferentes: via Docker ou através da instalação tradicional de dependências.

### 1. Docker

Para executar a API utilizando Docker, siga os seguintes passos:

```bash
docker build -t modern_click_store .
docker run -d -p 3000:3000 modern_click_store
```
### 2. Instalação Tradicional
```
 node index.js
 npm start
