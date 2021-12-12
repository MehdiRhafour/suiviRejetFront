import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import Spinner from "../../Spinner";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  Alert,
  InputAdornment,
  FormControlLabel,
} from "@material-ui/core";
import { LoadingButton } from "@material-ui/lab";
import AuthenticationService from "../../../services/AuthenticationService";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);
  const [showError, setShowError] = useState(false);

  /*  const LoginSchema = Yup.object().shape({
    matricule: Yup.string().required('Matricule requis'),
    password: Yup.string().required('Mot de passe requis')
  });*/

  const validate = (values) => {
    /*if (values.matricule === "") {
      errors.matricule = "Champs obligatoire";
    } else {
      errors.matricule = "";
    }

    if (values.password === "") {
      errors.password = "Champs obligatoire";
    } else {
      errors.password = "";
    } */
  };

  const formik = useFormik({
    initialValues: {
      matricule: "",
      password: "",
      remember: true,
    },
    validate,
    onSubmit: (values) => {
      setOpenSpinner(true);
      AuthenticationService.executeJWTAuthentication(
        values.matricule,
        values.password
      )
        .then((response) => {
          AuthenticationService.registerSuccessfulLoginforJWT(
            values.matricule,
            response.data.token
          );
          navigate(`/dashboard/app`);
          setOpenSpinner(false);
        })
        .catch((response) => {
          setShowError(true);
          setOpenSpinner(false);
        });
    },
  });

  const { errors, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    return;
  }, []);

  return (
    <FormikProvider value={formik}>
      <Spinner open={openSpinner} />
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {showError && (
            <Alert variant="filled" severity="error">
              <strong>Matricule ou mot de passe non valide</strong>
            </Alert>
          )}
          <TextField
            fullWidth
            name="matricule"
            type="text"
            label="Matricule"
            onChange={formik.handleChange}
            value={formik.values.matricule}
            error={Boolean(errors.matricule)}
            helperText={errors.matricule}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="Mot de passe"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
