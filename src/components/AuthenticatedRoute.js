import { Route, Navigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService.js";

export default function AuthenticatedRoute(props) {
  if (AuthenticationService.isUserLoggedIn()) {
    return <Route element={<props.component />} />;
  } else {
    return <Navigate to="/login" />;
  }
}
