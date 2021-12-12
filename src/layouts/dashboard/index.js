import { Outlet } from "react-router-dom";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
//
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import Spinner from "../../components/Spinner";
// Service
import AuthenticationService, {
  USERNAME_VALUE,
  AGENT_INFORMATIONS,
} from "../../services/AuthenticationService";
import { Component } from "react";
import account from "../../_mocks_/account";
import ErrorBoundary from "../../Exception/ErrorBoundary";
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openSpinner: false,
    };
  }

  getUserConnected() {
    if (sessionStorage.getItem(AGENT_INFORMATIONS) == null) {
      this.setState({
        openSpinner: true,
      });
      AuthenticationService.getAgentConnected(
        sessionStorage.getItem(USERNAME_VALUE)
      ).then((reponse) => {
        var data = JSON.stringify(reponse.data);
        AuthenticationService.registerAgentConnected(data);
        this.remplirAccount();
        this.setState({
          openSpinner: false,
          open: true,
        });
      });
    } else {
      this.setState({
        open: true,
      });
      this.remplirAccount();
    }
  }

  remplirAccount() {
    var data = JSON.parse(sessionStorage.getItem(AGENT_INFORMATIONS));
    account.displayName = data?.nom + " " + data?.prenom;
    account.email = data?.email;
    account.matricule = data?.matricule;
    account.typeAffectation = data?.typeAffectation?.libelle;
    account.affectation = data?.affectation?.libelle;
  }

  componentDidMount() {
    this.getUserConnected();
  }

  componentWillUnmount() {
    this.setState({
      open: false,
      openSpinner: false,
    });
    return;
  }

  render() {
    return (
      <RootStyle>
        <Spinner open={this.state.openSpinner} />
        <DashboardSidebar
          isOpenSidebar={this.state.open}
          onCloseSidebar={() => this.setState({ open: false })}
        />
        <MainStyle>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </MainStyle>
      </RootStyle>
    );
  }
}

export default DashboardLayout;
