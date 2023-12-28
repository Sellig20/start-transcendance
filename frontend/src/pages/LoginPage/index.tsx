import { string } from 'prop-types';
import Card from '../../components/Card/index'
import React, { useState } from 'react';
import { render } from '@testing-library/react';
 
interface Credentials {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    // Utiliser le hook useState pour gérer l'état du formulaire
    const [credentials, setCredentials] = useState<Credentials>({
        username: '',
        password: '',
    });

    // Fonction de gestion du changement d'entrée dans le formulaire
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ajoutez ici la logique d'authentification en utilisant les informations d'identification
        console.log('Credentials submitted:', credentials);
    };

    return (
        <div>
            <h1>Page d'authentification</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nom d'utilisateur:
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Mot de passe:
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;
