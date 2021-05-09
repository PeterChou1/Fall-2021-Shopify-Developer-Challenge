import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Context from "../../context";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  img: {
    maxWidth: "600px",
  },
}));

export default function DeleteModal({ open, handleClose }) {
  const classes = useStyles();
  const { userFactoryService, dispatch } = useContext(Context);
  const { deleteuser } = userFactoryService();
  const history = useHistory();

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={getModalStyle()} className={classes.paper}>
        <Typography>Are you sure you want to delete your account</Typography>
        <Button
          color="primary"
          onClick={() => {
            deleteuser();
            dispatch({
              type: "SET_STATE",
              state: {
                isAuthenticated: false,
                username: "",
                userid: null,
              },
            });
            handleClose();
            history.push("/");
          }}
        >
          Yes
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            handleClose();
          }}
        >
          No
        </Button>
      </div>
    </Modal>
  );
}
