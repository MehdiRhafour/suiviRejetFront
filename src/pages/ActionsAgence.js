import { useState, useEffect } from "react";
import { useFormik, Form, FormikProvider } from "formik";
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
  TextField,
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
// components
import Page from "../components/Page";

//service
import EnregistrementService from "../services/EnregistrementRejetService";
//
import { experimentalStyled as styled } from "@material-ui/core/styles";
import {
  ATTENTE_RECLAMATION,
  ENVOIE_RECOMMANDE,
  REMISE_ASSURE,
  SAISIE_REJET,
} from "../api/environnement/constants";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ActionsAgenceClass() {
  const RootStyle = styled(CardHeader)(({ theme }) => ({
    color: theme.palette.primary.darker,
    backgroundColor: theme.palette.primary.lighter,
    padding: 16,
  }));

  const RootStyleAssure = styled(CardHeader)(({ theme }) => ({
    color: theme.palette.info.darker,
    backgroundColor: theme.palette.info.lighter,
    padding: 16,
  }));

  const RootStyleRecherche = styled(CardHeader)(({ theme }) => ({
    color: theme.palette.error.darker,
    backgroundColor: theme.palette.error.lighter,
    padding: 16,
  }));

  const RootStyleHistoriqueRejet = styled(CardHeader)(({ theme }) => ({
    color: theme.palette.warning.darker,
    backgroundColor: theme.palette.warning.lighter,
    padding: 16,
  }));

  const [openSpinner, setOpenSpinner] = useState(false);
  const [isDataHere, setIsDataHere] = useState(false);
  var [dossierTracabilite, setDossierTracabilite] = useState();
  const [isResponseNull, setIsResponseNull] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [rowsTableHistorique, setRowsTableHistorique] = useState([]);
  const [actionEnregsitrer, setActionEnregsitrer] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [actionAgentClicked, setActionAgentClicked] = useState();
  const [tailleTableau, setTailleTableau] = useState();

  const onClickActionAgent = () => {
    EnregistrementService.EnregistrerActionsAgent(
      dossierTracabilite.idDossierAMO,
      actionAgentClicked
    ).then((response) => {
      if (response.data) {
        var data = JSON.stringify(response.data[0]?.dossierAMO);
        var rows = JSON.stringify(response.data);
        setRowsTableHistorique(JSON.parse(rows));
        setDossierTracabilite(JSON.parse(data));
        setActionEnregsitrer(true);
        handleClose();
      }
    });
  };

  const tailleTableauFunction = () => {
    if (
      dossierTracabilite?.dernierNiveauSuivi?.idNiveauSuivi === REMISE_ASSURE
    ) {
      console.log("ici1");
      setTailleTableau(12);
    } else {
      console.log("ici3");
      setTailleTableau(8);
    }
  };
  const handleOpen = (value) => {
    setTitleModal("Confirmer la validation");
    if (value === REMISE_ASSURE) {
      setMessageModal(
        "Êtes vous sûr de vouloir mettre ce dossier en état remis à l'assuré ?"
      );
    } else if (value === ATTENTE_RECLAMATION) {
      setMessageModal(
        "Êtes vous sûr de vouloir mettre ce dossier en état attente de réclamation  ?"
      );
    }
    setActionAgentClicked(value);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const formik = useFormik({
    initialValues: {
      numDossier: "",
    },
    onSubmit: (values) => {
      setOpenSpinner(true);
      EnregistrementService.getDossierAMOByNumDossier(values.numDossier)
        .then((response) => {
          if (response.data !== undefined) {
            var data = JSON.stringify(response.data[0]?.dossierAMO);
            var rows = JSON.stringify(response.data);
            setRowsTableHistorique(JSON.parse(rows));
            setDossierTracabilite(JSON.parse(data));
            setIsDataHere(true);
            setIsResponseNull(false);
            tailleTableauFunction();
          } else {
            setIsResponseNull(true);
          }

          setOpenSpinner(false);
        })
        .catch((response) => {
          setOpenSpinner(false);
        });
    },
  });

  const { errors, handleSubmit } = formik;

  return (
    <Page title="Actions">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Actions agence sur les rejets
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <RootStyleRecherche title="FORMULAIRE DE RECHERCHE" />
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Stack direction="row" alignItems="center">
                    <Grid item sx={{ p: 3, pl: 12 }} lg={8} dir="ltr">
                      <TextField
                        fullWidth
                        name="numDossier"
                        type="text"
                        label="N° du dossier"
                        onChange={formik.handleChange}
                        value={formik.values.numDossier}
                      />
                    </Grid>
                    <Grid item sx={{ p: 3, pl: 9 }} lg={4} dir="ltr">
                      <Button size="large" variant="contained" type="submit">
                        Chercher
                      </Button>
                    </Grid>
                  </Stack>
                </Form>
              </FormikProvider>
            </Card>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            {isResponseNull && (
              <Alert severity="success">
                <strong>Aucun dossier n'existe avec ce numéro.</strong>
              </Alert>
            )}
          </Grid>
          {isDataHere && (
            <>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <RootStyle
                    title={
                      "INFORMATIIONS DOSSIER N° : " +
                      dossierTracabilite?.numeroDossier
                    }
                  />
                  <CardContent>
                    <Stack mb={2} ml={5}>
                      <Stack direction="row" alignItems="left" spacing={12}>
                        <Typography variant="p">
                          N° IMM :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.numeroImmatriculation}
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Agence :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.agence?.libelle}
                          </Typography>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="left" spacing={12}>
                        <Typography variant="p">
                          Date dépôt :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {new Date(
                              dossierTracabilite?.dateDepot
                            ).toLocaleDateString("fr-CA", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Montant :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.montant}
                          </Typography>
                        </Typography>
                      </Stack>
                      <Typography variant="p">Type de soin :</Typography>
                      <Typography variant="p">
                        Motif de rejet de tracabilité :{" "}
                        <Typography
                          variant="subtitle2"
                          display="inline"
                          color="error"
                        >
                          {dossierTracabilite?.typeMotifRejetDossier?.libelle}
                        </Typography>
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <Card>
                  <RootStyleAssure title="CORDONNEES ASSURE & BENEFICIAIRE" />
                  <CardContent>
                    <Stack mb={1} ml={5}>
                      <Stack direction="row" alignItems="left" spacing={12}>
                        <Typography variant="p">
                          Assuré :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.assure?.nom}{" "}
                            {dossierTracabilite?.assure?.prenom}
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Bénéficiaire :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.nomBeneficiaire}{" "}
                            {dossierTracabilite?.prenomBeneficiaire}
                          </Typography>
                        </Typography>
                      </Stack>
                      <Typography variant="p">
                        Adresse assuré :{" "}
                        <Typography
                          variant="subtitle2"
                          display="inline"
                          color="error"
                        >
                          {dossierTracabilite?.adresseAssure}
                        </Typography>
                      </Typography>
                      <Stack direction="row" alignItems="left" spacing={12}>
                        <Typography variant="p">
                          Code postal :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.codePostal}
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Ville :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.ville}
                          </Typography>
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="left" spacing={12}>
                        <Typography variant="p">
                          Numéro téléphone :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.numeroTelAssure}
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Email :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            {dossierTracabilite?.emailAssure}
                          </Typography>
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                {actionEnregsitrer && (
                  <Alert severity="success">
                    <strong>l'action a bien été enregistré.</strong>
                  </Alert>
                )}
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <Card>
                  <RootStyleHistoriqueRejet title="HISTORIQUE DU REJET" />
                  <Stack direction="row" spacing={1}>
                    {dossierTracabilite?.dernierNiveauSuivi?.idNiveauSuivi !==
                      REMISE_ASSURE && (
                      <Grid item sx={{ p: 3, pl: 9 }} lg={4} dir="ltr">
                        <Button
                          size="large"
                          variant="contained"
                          onClick={() => handleOpen(REMISE_ASSURE)}
                        >
                          Dossier remis à l'assuré
                        </Button>
                      </Grid>
                    )}
                    {dossierTracabilite?.dernierNiveauSuivi?.idNiveauSuivi ===
                      ENVOIE_RECOMMANDE && (
                      <Grid item sx={{ p: 3, pl: 9 }} lg={4} dir="ltr">
                        <Button
                          ml={2}
                          size="large"
                          variant="contained"
                          onClick={() => handleOpen(ATTENTE_RECLAMATION)}
                        >
                          Retour PTT
                        </Button>
                      </Grid>
                    )}
                    <Dialog
                      open={openModal}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {titleModal}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          {messageModal}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          color="primary"
                          onClick={() => onClickActionAgent(actionAgentClicked)}
                          autoFocus
                        >
                          Valider
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Grid
                      item
                      sx={{ p: 3, pl: 9 }}
                      lg={tailleTableau}
                      dir="ltr"
                    >
                      <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                          <TableHead backgroundColor={"#e3f2fd"}>
                            <TableRow>
                              <TableCell align="center">
                                Date de suivi
                              </TableCell>
                              <TableCell align="center">
                                Niveau de suivi{" "}
                              </TableCell>
                              <TableCell align="center">Agent</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowsTableHistorique.map((row) => (
                              <TableRow key={row?.idSuiviDossierAMO}>
                                <TableCell align="center">
                                  {new Date(
                                    row?.dateActionNiveauSuivi
                                  ).toLocaleDateString("fr-CA", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })}
                                </TableCell>
                                <TableCell align="center">
                                  {row?.niveauSuivi?.libelle}{" "}
                                  {row?.niveauSuivi?.idNiveauSuivi ===
                                    SAISIE_REJET && (
                                    <Typography
                                      variant="subtitle2"
                                      display="inline"
                                      color="error"
                                    >
                                      {" - "}
                                      {
                                        dossierTracabilite
                                          ?.typeMotifRejetDossier?.libelle
                                      }
                                    </Typography>
                                  )}
                                  {row?.niveauSuivi?.idNiveauSuivi ===
                                    ENVOIE_RECOMMANDE && (
                                    <Typography
                                      variant="subtitle2"
                                      display="inline"
                                      color="error"
                                    >
                                      {" - "}
                                      {row?.numeroRecommande}
                                    </Typography>
                                  )}
                                </TableCell>
                                {row?.agentAction?.nom && (
                                  <TableCell align="center">
                                    {row?.agentAction?.nom}{" "}
                                    {row?.agentAction?.prenom}
                                  </TableCell>
                                )}
                                {!row?.agentAction?.nom && (
                                  <TableCell align="center">AUTOMATE</TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Stack>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
