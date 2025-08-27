import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import inptLogo from '../assets/logos/inpt-logo.png';
import api from '../services/api'; // ton axios configuré

function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Appel API Spring Boot
      await api.post('/api/v1/auth/register', {
        firstname,
        lastname,
        email,
        password
      });

      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={inptLogo} alt="INPT Logo" className="h-8" />
            <span className="font-bold text-xl">INPT</span>
          </div>
          <Link to="/" className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <span className="material-icons">arrow_back</span>
            Retour au site
          </Link>
        </div>
      </header>

      {/* Formulaire */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Créer un compte</h1>
          <p className="text-gray-600 text-center mb-8">
            Inscrivez-vous pour accéder à l'espace candidat
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  placeholder="Votre prénom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  placeholder="Votre nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre.email@exemple.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Créez votre mot de passe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <span className="material-icons">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirmez votre mot de passe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <span className="material-icons">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                J'accepte les <a href="#" className="text-blue-600 hover:text-blue-800">conditions d'utilisation</a> et la <a href="#" className="text-blue-600 hover:text-blue-800">politique de confidentialité</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Création en cours...' : 'Créer un compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Déjà inscrit ? Connectez-vous
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer identique à ta version */}
    </div>
  );
}

export default Register;
