import axios from "axios";
import { API_URL } from "../api/environnement/constants";

class EnregistrementService {
  getDossierTracabiliteByNumDossier(numDossier) {
    return axios.get(`${API_URL}/tracabilite/${numDossier}`);
  }

  getDossierAMOByNumDossier(numDossier) {
    return axios.get(`${API_URL}/dossierAMO/${numDossier}`);
  }

  EnregistrerActionsAgent(idDossierAMO, idAction) {
    return axios.get(
      `${API_URL}/actionAgence/saveAction/${idDossierAMO}/${idAction}`
    );
  }

  EnregistrerEnvoieRecommande(data) {
    return axios.post(
      `${API_URL}/dossiersAReexpedier/saveDossierReexpedier`,
      data
    );
  }

  getDossierAMOByNumDossierAndIMM(data) {
    return axios.post(`${API_URL}/dossier/consultationDossier`, data);
  }
}

export default new EnregistrementService();
