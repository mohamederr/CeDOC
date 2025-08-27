import api from './api';

// Récupérer toutes les candidatures pour le professeur connecté
export const getCandidatures = async () => {
  try {
    const response = await api.get('/api/professeurs/candidatures');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    throw error;
  }
};

// Télécharger le dossier d'un candidat
export const downloadDossier = async (candidatureId) => {
  try {
    const response = await api.get(`/api/candidatures/${candidatureId}/dossier`, {
      responseType: 'blob', // Important pour les fichiers
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du téléchargement du dossier:', error);
    throw error;
  }
};

// Planifier un entretien
export const planifierEntretien = async (candidatureId, dateEntretien) => {
  try {
    const response = await api.post(`/api/candidatures/${candidatureId}/entretien`, {
      dateEntretien,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la planification de l\'entretien:', error);
    throw error;
  }
};