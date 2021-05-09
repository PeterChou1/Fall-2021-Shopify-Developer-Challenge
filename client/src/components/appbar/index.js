import React, { useContext, useState, useEffect } from "react";
import Context from "../../context";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import DeleteModal from "./DeleteModal";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { authFactoryService, dispatch, isAuthenticated, userid } = useContext(
    Context
  );
  const { signout } = authFactoryService();
  const handleOpen = () => {
    setDeleteModal(true);
  };
  const handleClose = () => {
    setDeleteModal(false);
  };

  useEffect(() => {
    // on refresh parse cookie for credentials
    if (document.cookie) {
      const parseCookie = (str) =>
        str
          .split(";")
          .map((v) => v.split("="))
          .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
              v[1].trim()
            );
            return acc;
          }, {});
      const cookie = parseCookie(document.cookie);
      if (cookie.username && cookie.userid) {
        dispatch({
          type: "SET_STATE",
          state: {
            isAuthenticated: true,
            userid: parseInt(cookie.userid),
            username: cookie.username,
          },
        });
      }
    }
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated ? (
            <IconButton
              edge="start"
              onClick={() => {
                history.push(`/profile/${userid}`);
              }}
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <HomeIcon />
            </IconButton>
          ) : null}
          <Button
            color="inherit"
            onClick={() => {
              history.push("/");
            }}
          >
            Browse
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              if (isAuthenticated) {
                signout();
                dispatch({
                  type: "SET_STATE",
                  state: {
                    isAuthenticated: false,
                    username: "",
                    userid: null,
                  },
                });
                history.push("/");
              } else {
                history.push("/login");
              }
            }}
          >
            {isAuthenticated ? "Signout" : "Login or Signup"}
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleOpen}>
              delete user
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <DeleteModal
        open={openDeleteModal}
        handleClose={handleClose}
      ></DeleteModal>
    </div>
  );
}
