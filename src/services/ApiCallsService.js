import axios from "axios";
import { API_URL } from "../api/environnement/constants";

class ApiCallsService {
  getTypesMotifRejet() {
    return axios.get(`${API_URL}/parametrage/getMotifRejet`);
  }

  getParametreConsultationEncours() {
    return axios.get(`${API_URL}/parametrage/getParametresConsultationEncours`);
  }

  enregsitrerRejet(data) {
    return axios.post(`${API_URL}/rejet/saveRejet`, data);
  }

  getDossierAReexpedier() {
    return axios.get(`${API_URL}/dossiersAReexpedier`);
  }
}

export default new ApiCallsService();
