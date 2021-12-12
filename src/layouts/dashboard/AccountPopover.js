import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// material
import { alpha } from "@material-ui/core/styles";
import {
  Button,
  Box,
  Divider,
  Typography,
  Avatar,
  IconButton,
} from "@material-ui/core";
// components
import MenuPopover from "../../components/MenuPopover";
//
import account from "../../_mocks_/account";
import Spinner from "../../components/Spinner";
import AuthenticationService from "../../services/AuthenticationService";

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    setOpenSpinner(true);
    AuthenticationService.logout();
    navigate(`/login`);
    setOpenSpinner(false);
  };

  return (
    <>
      <Spinner open={openSpinner} />
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="outlined" onClick={logOut}>
            Logout
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

/*{MENU_OPTIONS.map((option) => (
  <MenuItem
    key={option.label}
    to={option.linkTo}
    component={RouterLink}
    onClick={handleClose}
    sx={{ typography: "body2", py: 1, px: 2.5 }}
  >
    <Box
      component={Icon}
      icon={option.icon}
      sx={{
        mr: 2,
        width: 24,
        height: 24,
      }}
    />

    {option.label}
  </MenuItem>
))} */
