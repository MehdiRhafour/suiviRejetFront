import axios from "axios";
import { API_URL } from "../api/environnement/constants";

export const USERNAME_VALUE = "authenticatedUsername";
export const AGENT_INFORMATIONS = "agentConnectedInformations";

class AuthenticationService {
  executeJWTAuthentication(username, password) {
    return axios.post(`${API_URL}/authenticate`, {
      username: username,
      password: password,
    });
  }

  getAgentConnected(usename) {
    return axios.get(`${API_URL}/agent/${usename}`);
  }

  //registerSuccessfulLoginforJWT

  getJWTAuthToken(token) {
    return "Bearer " + token;
  }

  registerSuccessfulLoginforJWT(username, token) {
    sessionStorage.setItem(USERNAME_VALUE, username);
    sessionStorage.setItem("token", token);
    this.setUpAxiosInterceptor(
      this.getJWTAuthToken(sessionStorage.getItem("token"))
    );
  }

  registerAgentConnected(agent) {
    sessionStorage.setItem(AGENT_INFORMATIONS, agent);
  }

  logout() {
    sessionStorage.removeItem(USERNAME_VALUE);
    sessionStorage.removeItem(AGENT_INFORMATIONS);
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem(USERNAME_VALUE);
    if (user === null) return false;
    return true;
  }

  getUserLoggedIn() {
    return sessionStorage.getItem(USERNAME_VALUE);
  }

  setUpAxiosInterceptor(token) {
    axios.interceptors.request.use((config) => {
      if (this.isUserLoggedIn()) {
        config.headers.authorization = token;
      }
      return config;
    });
  }
}

export default new AuthenticationService();
