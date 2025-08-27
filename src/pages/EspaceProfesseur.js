import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectForm from '../components/professor/SubjectForm';
import SubjectList from '../components/professor/SubjectList';
import CandidatureList from '../components/professor/CandidatureList';
import inptLogo from '../assets/logos/inpt-logo.png';
import './EspaceProfesseur.css';
import { getCandidatures, downloadDossier, planifierEntretien } from '../services/candidatureService';

export default function EspaceProfesseur() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [candidatures, setCandidatures] = useState([]);
  const [candidatureFilter, setCandidatureFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les candidatures depuis l'API
  useEffect(() => {
    if (activeTab === 'candidatures') {
      const fetchCandidatures = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getCandidatures();
          setCandidatures(data);
        } catch (err) {
          setError('Erreur lors du chargement des candidatures');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCandidatures();
    }
  }, [activeTab]);

  // Données simulées pour les sujets (à remplacer par un appel API si nécessaire)
  useEffect(() => {
    const mockSubjects = [
      {
        id: 1,
        title: "IA pour réseaux 5G",
        description: "Recherche sur l'optimisation des réseaux 5G par IA",
        domain: "IA",
        team: "LTI",
        professor: "Pr. Ahmed Benali",
        status: "pending",
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Blockchain pour la supply chain",
        description: "Application de la blockchain dans les chaînes logistiques",
        domain: "Blockchain",
        team: "DISCO",
        professor: "Pr. Ahmed Benali",
        status: "validated",
        createdAt: new Date()
      }
    ];
    setSubjects(mockSubjects);
  }, []);

  const handleAddSubject = (newSubject) => {
    setSubjects([
      ...subjects,
      {
        ...newSubject,
        id: Date.now(),
        professor: "Pr. Ahmed Benali",
        status: "pending",
        createdAt: new Date()
      }
    ]);
    setEditingSubject(null);
  };

  const handleUpdateSubject = (updatedSubject) => {
    setSubjects(
      subjects.map(sub => 
        sub.id === updatedSubject.id ? updatedSubject : sub
      )
    );
    setEditingSubject(null);
  };

  const handleDeleteSubject = (subjectId) => {
    setSubjects(subjects.filter(sub => sub.id !== subjectId));
  };

  const handleDownloadDossier = async (candidatureId, nomCandidat) => {
    try {
      const blob = await downloadDossier(candidatureId);
      
      // Créer un URL pour le blob et déclencher le téléchargement
      const url = window.URL.createObjectURL(new Blob([blob]));
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
      console.error(error);
    }
  };

  const handlePlanifierEntretien = async (candidatureId) => {
    const date = prompt('Entrez la date et l\'heure de l\'entretien (format: YYYY-MM-DDTHH:MM)');
    if (date) {
      try {
        await planifierEntretien(candidatureId, date);
        alert('Entretien planifié avec succès!');
        
        // Recharger les candidatures pour voir les éventuels changements
        const data = await getCandidatures();
        setCandidatures(data);
      } catch (error) {
        alert('Erreur lors de la planification de l\'entretien');
        console.error(error);
      }
    }
  };

  const filteredSubjects = subjects.filter(sub => 
    statusFilter === 'all' || sub.status === statusFilter
  );

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
                <h1 className="text-2xl md:text-3xl font-bold text-[#003366] mb-2">Espace Professeur</h1>
                <p className="text-gray-600">Bienvenue, Pr. Ahmed Benali</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                  <span className="material-icons mr-2">notifications</span>
                  Notifications
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <span className="material-icons mr-2">settings</span>
                  Paramètres
                </button>
              </div>
            </div>
            
            {/* Onglets */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'subjects'
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
                <button
                  onClick={() => setActiveTab('meetings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'meetings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Entretiens
                </button>
              </nav>
            </div>
            
            {/* Contenu des onglets */}
            {activeTab === 'subjects' && (
              <div className="professor-content">
                <div className="subject-form-section">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingSubject ? "Modifier un sujet" : "Proposer un nouveau sujet"}
                  </h2>
                  <SubjectForm 
                    onSubmit={editingSubject ? handleUpdateSubject : handleAddSubject}
                    initialData={editingSubject}
                    onCancel={() => setEditingSubject(null)}
                  />
                </div>
                
                <div className="subject-list-section">
                  <div className="filters flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Vos sujets proposés</h2>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">Tous les sujets</option>
                      <option value="pending">En attente</option>
                      <option value="validated">Validés</option>
                    </select>
                  </div>
                  
                  <SubjectList 
                    subjects={filteredSubjects}
                    onEdit={setEditingSubject}
                    onDelete={handleDeleteSubject}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'candidatures' && (
              <div className="candidatures-section">
                <div className="filters flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Candidatures pour vos sujets</h2>
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
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                {!loading && !error && (
                  <CandidatureList 
                    candidatures={filteredCandidatures} 
                    onDownloadDossier={handleDownloadDossier}
                    onPlanifierEntretien={handlePlanifierEntretien}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'meetings' && (
              <div className="meetings-section">
                <h2 className="text-xl font-semibold mb-6">Entretiens planifiés</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Prochain entretien</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Planifier un entretien
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4">
                          <h4 className="font-semibold">Karim El Mansouri</h4>
                          <p className="text-sm text-gray-600">Sujet: IA pour réseaux 5G</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="flex items-center text-sm text-gray-600">
                          <span className="material-icons mr-2">schedule</span>
                          Lundi 30 octobre, 10:00 - 11:00
                        </p>
                        <p className="flex items-center text-sm text-gray-600 mt-1">
                          <span className="material-icons mr-2">location_on</span>
                          Salle B203
                        </p>
                      </div>
                    </div>
                  </div>
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