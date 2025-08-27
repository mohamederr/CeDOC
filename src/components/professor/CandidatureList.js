// components/professor/CandidatureList.js
import React from 'react';

export default function CandidatureList({ candidatures, onDownloadDossier, onPlanifierEntretien }) {
  const getStatusColor = (status) => {
    switch(status) {
      case "Acceptée":
        return "bg-green-100 text-green-800";
      case "Refusée":
        return "bg-red-100 text-red-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (candidatures.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune candidature à afficher pour le moment
      </div>
    );
  }

  return (
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
          {candidatures.map((candidature) => (
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
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(candidature.statut)}`}>
                  {candidature.statut}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onDownloadDossier(candidature.id, candidature.nom)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Dossier
                </button>
                <button
                  onClick={() => onPlanifierEntretien(candidature.id)}
                  className="text-green-600 hover:text-green-900"
                >
                  Entretien
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}