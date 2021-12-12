// material
import {
  CardHeader,
  CardContent,
  Grid,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";

// components
//import Modal from "@material-ui/core/Modal";
import Page from "../components/Page";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Component } from "react";
import ApiCallsService from "../services/ApiCallsService";
import Spinner from "../components/Spinner";
import EnregistrementRejetService from "../services/EnregistrementRejetService";
import { ENVOIE_RECOMMANDE } from "../api/environnement/constants";

const RootStyleRecherche = styled(CardHeader)(({ theme }) => ({
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter,
  padding: 16,
}));

class DossierAReexpedier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsTableDossier: [],
      showSpinner: false,
      isDataHere: false,
      openModal: false,
      numRecommande: "",
      actionEnregsitrer: false,
      indexDossierAReexpedier: null,
      subtitle: {
        style: {
          color: "",
        },
      },
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validate = this.validate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  getDossierAReexpedier() {
    this.setState({
      showSpinner: true,
    });
    ApiCallsService.getDossierAReexpedier().then((response) => {
      var rows = JSON.stringify(response.data);
      this.setState({
        showSpinner: false,
        isDataHere: true,
        rowsTableDossier: JSON.parse(rows),
      });
    });
  }

  handleOpen(value) {
    this.setState({
      openModal: true,
      indexDossierAReexpedier: value,
    });
  }

  handleClose() {
    this.setState({
      openModal: false,
    });
  }

  componentDidMount() {
    this.getDossierAReexpedier();
  }

  /* afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.setState({
      subtitle: {
        style: {
          color: "#f00",
        },
      },
    });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.setState({
      subtitle: {
        style: {
          color: "#f00",
        },
      },
    });
  } */

  onSubmit(values) {
    EnregistrementRejetService.EnregistrerEnvoieRecommande({
      idDossierAMO: this.state.indexDossierAReexpedier,
      idAction: ENVOIE_RECOMMANDE,
      numeroRecommande: values.numRecommande,
    }).then((response) => {
      var rows = JSON.stringify(response.data);
      this.setState({
        actionEnregsitrer: true,
        rowsTableDossier: JSON.parse(rows),
      });
      this.handleClose();
    });
    /*   if (this.props.match.params.id === -1) {
      TodoService.AddTodo({
        description: this.state.description,
        targetDate: this.state.targetDate,
      }).then(() => this.props.history.push("/todo"));
    } else {
      TodoService.updateTodo(this.state.id, {
        id: this.state.id,
        description: values.description,
        targetDate: values.targetDate,
      }).then(() => this.props.history.push("/todo"));
    }*/
  }

  validate(values) {
    let errors = {};
    if (!values.numRecommande) {
      errors.numRecommande = "le numéro recommandé est obligatoire";
    }
    return errors;
  }

  render() {
    let { numRecommande } = this.state;
    return (
      <Page title="Dossier à réexpédier ">
        <Spinner open={this.state.showSpinner} />
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={5}
          >
            <Typography variant="h4" gutterBottom>
              Dossier à réexpédier
            </Typography>
          </Stack>
          {this.state.isDataHere && (
            <>
              <Grid item xs={12} md={12} lg={12}>
                {this.state.actionEnregsitrer && (
                  <Alert severity="success">
                    <strong>l'action a bien été enregistré.</strong>
                  </Alert>
                )}
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <Card>
                    <RootStyleRecherche title="LISTE DES DOSSIERS A REEXPEDIER" />
                    <CardContent>
                      <Grid item xs={12} md={12} lg={12}>
                        {this.state.rowsTableDossier.length === 0 && (
                          <Typography>Aucun dossier à réexpédier</Typography>
                        )}
                      </Grid>
                      {this.state.rowsTableDossier.length > 0 && (
                        <TableContainer component={Paper}>
                          <Table aria-label="simple table">
                            <TableHead backgroundColor={"#e3f2fd"}>
                              <TableRow>
                                <TableCell align="center">N° Dossier</TableCell>
                                <TableCell align="center">N° IMMA </TableCell>
                                <TableCell align="center">Date Rejet</TableCell>
                                <TableCell align="center">Nom Assuré</TableCell>
                                <TableCell align="center">
                                  Nom Bénéficiaire
                                </TableCell>
                                <TableCell align="center">DR</TableCell>
                                <TableCell align="center">Agence</TableCell>
                                <TableCell align="center">Retard</TableCell>
                                <TableCell align="center">Gestion</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {this.state.rowsTableDossier.map((row) => (
                                <TableRow key={row?.idDossierAMO}>
                                  <TableCell align="center">
                                    {row?.numeroDossier}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row?.numeroImmatriculation}
                                  </TableCell>
                                  <TableCell align="center">
                                    {new Date(
                                      row?.dateEnregistrementAMO
                                    ).toLocaleDateString("fr-CA", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row?.nomAssure} {row?.prenomAssure}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row?.nomBeneficiaire}{" "}
                                    {row?.prenomBeneficiaire}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row?.directionGenerale?.libelle}
                                  </TableCell>
                                  <TableCell align="center">
                                    {row?.agence?.libelle}
                                  </TableCell>
                                  <TableCell align="center">0</TableCell>
                                  <TableCell align="center">
                                    <Button
                                      onClick={() =>
                                        this.handleOpen(row?.idDossierAMO)
                                      }
                                      size="large"
                                      type="submit"
                                      variant="contained"
                                    >
                                      Réexpédier
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}

                      <Dialog
                        open={this.state.openModal}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Réexpédier un dossier "}
                        </DialogTitle>
                        <Formik
                          initialValues={{ numRecommande }}
                          onSubmit={this.onSubmit}
                          validateOnChange={true}
                          validateOnBlur={true}
                          validate={this.validate}
                          enableReinitialize={true}
                        >
                          <Form>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Veuillez entrez un numéro recommandé du dossier
                                à réexpédier :
                                <Grid mt={2} ml={5}>
                                  <Field
                                    style={{
                                      width: "370px",
                                      height: "40px",
                                      border: "2px solid #00AB55",
                                      borderRadius: "5px",
                                    }}
                                    className="form-control"
                                    name="numRecommande"
                                    type="text"
                                    variant="outlined"
                                  />
                                  <ErrorMessage
                                    style={{
                                      color: "red",
                                    }}
                                    name="numRecommande"
                                    className="alert alert-warning"
                                    component="div"
                                  />
                                </Grid>
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button color="primary" type="submit" autoFocus>
                                Valider
                              </Button>
                            </DialogActions>
                          </Form>
                        </Formik>
                      </Dialog>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Page>
    );
  }
}

export default DossierAReexpedier;
