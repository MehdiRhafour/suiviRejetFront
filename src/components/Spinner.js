import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles, Theme } from "@material-ui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function Spinner(props) {
  const classes = useStyles();
  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
