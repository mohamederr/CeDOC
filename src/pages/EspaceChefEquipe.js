// src/pages/EspaceChefEquipe.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import inptLogo from '../assets/logos/inpt-logo.png';
import api from '../services/api';

function EspaceChefEquipe() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sujets');
  const [subjects, setSubjects] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [candidatureFilter, setCandidatureFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les sujets de l'équipe
  const fetchSujetsEquipe = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/CHEF_EQUIPE/getSujetsEquipe');
      setSubjects(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des sujets');
      console.error('Erreur API getSujetsEquipe:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les candidatures
  const fetchCandidatures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/CHEF_EQUIPE/getCandidatures');
      setCandidatures(response.data);
    } catch (error) {
      setError('Erreur lors du chargement des candidatures');
      console.error('Erreur API getCandidatures:', error);
    } finally {
      setLoading(false);
    }
  };

  // Valider un sujet
  const validateSubject = async (subjectId) => {
    try {
      await api.put(`/api/v1/CHEF_EQUIPE/validerSujet/${subjectId}`);
      
      // Mettre à jour l'état local
      setSubjects(subjects.map(sub => 
        sub.id === subjectId ? { ...sub, status: 'validated' } : sub
      ));
      
      alert('Sujet validé avec succès!');
    } catch (error) {
      alert('Erreur lors de la validation du sujet');
      console.error('Erreur API validerSujet:', error);
    }
  };

  // Refuser un sujet
  const rejectSubject = async (subjectId) => {
    try {
      await api.put(`/api/v1/CHEF_EQUIPE/refuserSujet/${subjectId}`);
      
      // Mettre à jour l'état local
      setSubjects(subjects.map(sub => 
        sub.id === subjectId ? { ...sub, status: 'rejected' } : sub
      ));
      
      alert('Sujet refusé avec succès!');
    } catch (error) {
      alert('Erreur lors du refus du sujet');
      console.error('Erreur API refuserSujet:', error);
    }
  };

  // Modifier le statut d'une candidature
  const updateCandidatureStatus = async (candidatureId, newStatus) => {
    try {
      // Ici, vous devrez adapter l'endpoint en fonction de votre API
      // Cet endpoint n'a pas été fourni dans votre liste
      await api.put(`/api/v1/CHEF_EQUIPE/candidatures/${candidatureId}/statut`, {
        statut: newStatus
      });
      
      // Mettre à jour l'état local
      setCandidatures(candidatures.map(cand => 
        cand.id === candidatureId ? { ...cand, statut: newStatus } : cand
      ));
      
      alert('Statut de la candidature mis à jour!');
    } catch (error) {
      alert('Erreur lors de la mise à jour du statut');
      console.error('Erreur API updateCandidatureStatus:', error);
    }
  };

  // Télécharger un dossier
  const downloadDossier = async (candidatureId, nomCandidat) => {
    try {
      const response = await api.get(`/api/v1/CHEF_EQUIPE/candidatures/${candidatureId}/dossier`, {
        responseType: 'blob'
      });
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dossier_${nomCandidat}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Libérer l'URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erreur lors du téléchargement du dossier');
      console.error('Erreur API downloadDossier:', error);
    }
  };

  // Charger les données lorsque l'onglet change
  useEffect(() => {
    if (activeTab === 'sujets') {
      fetchSujetsEquipe();
    } else if (activeTab === 'candidatures') {
      fetchCandidatures();
    }
  }, [activeTab]);

  // Filtrer les sujets par statut
  const filteredSubjects = subjects.filter(sub => 
    subjectFilter === 'all' || sub.status === subjectFilter
  );

  // Filtrer les candidatures par statut
  const filteredCandidatures = candidatures.filter(cand => 
    candidatureFilter === 'all' || cand.statut === candidatureFilter
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={inptLogo} alt="INPT Logo" className="h-8" />
            <span className="font-bold text-xl">INPT</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <span className="material-icons">arrow_back</span>
            Retour au site
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#003366] mb-2">
                  Espace Chef d'Équipe
                </h1>
                <p className="text-gray-600">Bienvenue, Dr. Ahmed Benali (Équipe SIVA)</p>
              </div>
            </div>
            
            {/* Onglets */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('sujets')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'sujets'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestion des sujets
                </button>
                <button
                  onClick={() => setActiveTab('candidatures')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'candidatures'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gestion des candidatures
                </button>
              </nav>
            </div>
            
            {/* Messages d'erreur */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {/* Contenu des onglets */}
            {activeTab === 'sujets' && (
              <div>
                <div className="filters flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Sujets proposés par votre équipe</h2>
                  <select 
                    value={subjectFilter} 
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">Tous les sujets</option>
                    <option value="pending">En attente</option>
                    <option value="validated">Validés</option>
                    <option value="rejected">Refusés</option>
                  </select>
                </div>
                
                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Chargement des sujets...</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {!loading && filteredSubjects.map(subject => (
                    <div 
                      key={subject.id}
                      className={`p-6 border rounded-lg ${
                        subject.status === 'validated' ? 'border-green-200 bg-green-50' :
                        subject.status === 'rejected' ? 'border-red-200 bg-red-50' :
                        'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{subject.title}</h3>
                          <p className="text-gray-600">{subject.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subject.status === 'validated' ? 'bg-green-100 text-green-800' :
                          subject.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subject.status === 'validated' ? 'Validé' : 
                           subject.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600"><strong>Domaine:</strong> {subject.domain}</p>
                          <p className="text-sm text-gray-600"><strong>Proposé par:</strong> {subject.professor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600"><strong>Date de proposition:</strong> {new Date(subject.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600"><strong>Équipe:</strong> {subject.team}</p>
                        </div>
                      </div>
                      
                      {subject.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => validateSubject(subject.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            Valider le sujet
                          </button>
                          <button
                            onClick={() => rejectSubject(subject.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Refuser le sujet
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {!loading && filteredSubjects.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      Aucun sujet à afficher pour le moment
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'candidatures' && (
              <div>
                <div className="filters flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Candidatures pour votre équipe</h2>
                  <select 
                    value={candidatureFilter} 
                    onChange={(e) => setCandidatureFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">Toutes les candidatures</option>
                    <option value="En attente">En attente</option>
                    <option value="Acceptée">Acceptées</option>
                    <option value="Refusée">Refusées</option>
                  </select>
                </div>
                
                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Chargement des candidatures...</p>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sujet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {!loading && filteredCandidatures.map(candidature => (
                        <tr key={candidature.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{candidature.nom}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidature.sujet}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidature.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              candidature.statut === 'Acceptée' ? 'bg-green-100 text-green-800' :
                              candidature.statut === 'Refusée' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {candidature.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => downloadDossier(candidature.id, candidature.nom)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Dossier
                              </button>
                              <button
                                onClick={() => updateCandidatureStatus(candidature.id, 'Acceptée')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accepter
                              </button>
                              <button
                                onClick={() => updateCandidatureStatus(candidature.id, 'Refusée')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Refuser
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {!loading && filteredCandidatures.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                      Aucune candidature à afficher pour le moment
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a237e] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} INPT - Centre d'Études Doctorales. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default EspaceChefEquipe;