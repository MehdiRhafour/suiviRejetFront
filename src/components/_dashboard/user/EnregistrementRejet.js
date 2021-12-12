import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Grid,
  Card,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@material-ui/core";
import ApiCallsService from "../../../services/ApiCallsService";
import { useEffect, useState } from "react";

export default function EnregistrementRejet(props) {
  const [typeMotifRejet, setTypeMotifRejet] = useState();
  const [isEnregistrementFait, setIsEnregistrementFait] = useState(false);

  useEffect(() => {
    // Met à jour le titre du document via l’API du navigateur
    ApiCallsService.getTypesMotifRejet().then((res) => {
      var data = JSON.stringify(res.data);
      setTypeMotifRejet(JSON.parse(data));
    });
    return null;
  }, []);

  const validate = (values) => {
    if (values.numTel === "") {
      errors.numTel = "Champs obligatoire";
    }
  };

  const formik = useFormik({
    initialValues: {
      numTel: "",
      adresseAssure: "",
      motifRejet: "",
    },
    validate,
    onSubmit: (values) => {
      var postData = {
        idTracabiliteDossier: "" + props.idTracabiliteDossier,
        adresseAssure: "" + values.adresseAssure,
        idMotifRejet: "" + values.motifRejet,
        numeroTele: "" + values.numTel,
      };
      ApiCallsService.enregsitrerRejet(postData).then((res) => {
        setIsEnregistrementFait(true);
      });
    },
  });

  const { errors, handleSubmit } = formik;

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        {isEnregistrementFait && (
          <Alert severity="success">
            <strong>Le dossier a bien été saisie.</strong>
          </Alert>
        )}
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Card>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={1} m={5}>
                <Grid item xs={12} md={12} lg={3}>
                  <TextField
                    fullWidth
                    name="numTel"
                    type="text"
                    label="N° de Téléphonse"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numTel}
                    error={Boolean(errors.numTel)}
                    helperText={errors.numTel}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <TextField
                    fullWidth
                    name="adresseAssure"
                    type="text"
                    label="Adresse assuré"
                    onChange={formik.handleChange}
                    value={formik.values.adresseAssure}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                  <FormControl variant="outlined">
                    <InputLabel>Motif de rejet</InputLabel>
                    <Select
                      native
                      label="Motif de rejet "
                      inputProps={{
                        name: "motifRejet",
                      }}
                      onChange={formik.handleChange}
                      value={formik.values.motifRejet}
                    >
                      <option value=""></option>
                      {typeMotifRejet?.map((element) => (
                        <option value={element.idTypeRejetDossier}>
                          {element.libelle}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={2}>
                  <Button size="large" variant="contained" type="submit">
                    Valider
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Card>
      </Grid>
    </>
  );
}
