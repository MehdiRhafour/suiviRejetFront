import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import EnregistrementRejet from "../components/_dashboard/user/EnregistrementRejet";
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
} from "@material-ui/core";

// components
import Page from "../components/Page";

//service
import EnregistrementService from "../services/EnregistrementRejetService";
//
import Spinner from "../components/Spinner";
import { experimentalStyled as styled } from "@material-ui/core/styles";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function User() {
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

  const [openSpinner, setOpenSpinner] = useState(false);
  const [isDataHere, setIsDataHere] = useState(false);
  var [dossierTracabilite, setDossierTracabilite] = useState();
  const [isResponseNull, setIsResponseNull] = useState(false);

  const formik = useFormik({
    initialValues: {
      numDossier: "",
    },
    onSubmit: (values) => {
      setOpenSpinner(true);
      EnregistrementService.getDossierTracabiliteByNumDossier(values.numDossier)
        .then((response) => {
          if (response.data) {
            var data = JSON.stringify(response.data);
            setIsDataHere(true);
            setDossierTracabilite(JSON.parse(data));
            setIsResponseNull(false);
          } else {
            setIsDataHere(false);
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
    <Page title="Enregistrement tracabilité">
      <Spinner open={openSpinner} />
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Enregistrement des rejets
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
                      <Typography variant="p">
                        Type de soin :{" "}
                        <Typography
                          variant="subtitle2"
                          display="inline"
                          color="error"
                        >
                          {dossierTracabilite?.typeSoin?.libelle}
                        </Typography>
                      </Typography>
                      <Typography variant="p">
                        Motif de rejet de tracabilité :{" "}
                        <Typography
                          variant="subtitle2"
                          display="inline"
                          color="error"
                        >
                          {dossierTracabilite?.typeSoin?.libelle}
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
                            10120
                          </Typography>
                        </Typography>
                        <Typography variant="p">
                          Ville :{" "}
                          <Typography
                            variant="subtitle2"
                            display="inline"
                            color="error"
                          >
                            Casablanca
                          </Typography>
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {!dossierTracabilite?.etatDossierTracabilite && (
                <EnregistrementRejet
                  idTracabiliteDossier={
                    dossierTracabilite?.idTracabiliteDossier
                  }
                />
              )}
              {dossierTracabilite?.etatDossierTracabilite && (
                <Grid item xs={12} md={12} lg={12}>
                  <Alert severity="success">
                    <strong>Ce dossier à été déja enregsitré.</strong>
                  </Alert>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
