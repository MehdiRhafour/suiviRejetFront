import { Navigate, useRoutes } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
// layouts
import DashboardLayout from "./layouts/dashboard";
//import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
//
import Login from "./pages/Login";
//import Register from './pages/Register';
/*import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';*/
import NotFound from "./pages/Page404";
import User from "./pages/User";
import ActionsAgence from "./pages/ActionsAgence";
import DossierAReexpedier from "./pages/DossierAReexpedier";
import ConsultationDossierIMM from "./pages/ConsultationDossierIMM";
import ConsultationEncours from "./pages/ConsultationEncours";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { path: "/", element: <Navigate to="/dashboard/app" replace /> },
        {
          path: "app",
          element: (
            <AuthenticatedRoute path="/dashboard/app" exact component={User} />
          ),
        },
        {
          path: "actions",
          element: (
            <AuthenticatedRoute
              path="/dashboard/actions"
              exact
              component={ActionsAgence}
            />
          ),
        },
        {
          path: "dossierAReexpedier",
          element: (
            <AuthenticatedRoute
              path="/dashboard/dossierAReexpedier"
              exact
              component={DossierAReexpedier}
            />
          ),
        },
        {
          path: "consDossierIMM",
          element: (
            <AuthenticatedRoute
              path="/dashboard/consDossierIMM"
              exact
              component={ConsultationDossierIMM}
            />
          ),
        },
        {
          path: "consultationEncours",
          element: (
            <AuthenticatedRoute
              path="/dashboard/consultationEncours"
              exact
              component={ConsultationEncours}
            />
          ),
        },
        //        { path: 'user', element: <User /> },
        //{ path: "products", element: <Products /> },
        //    { path: 'blog', element: <Blog /> }
      ],
    },
    {
      path: "/",
      element: <LogoOnlyLayout />,
      children: [
        { path: "login", element: <Login /> },
        //     { path: 'register', element: <Register /> },
        { path: "404", element: <NotFound /> },
        { path: "", element: <Navigate to="/Login" /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },

    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
