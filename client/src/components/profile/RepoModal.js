import React, { useContext, useEffect } from "react";
import Context from "../../context";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function RepoModal(props) {
  const { repoFactoryService } = useContext(Context);
  const { addrepo, updaterepo } = repoFactoryService();
  const classes = useStyles();
  const [formstate, setFormState] = React.useState({
    permission: "PUBLIC",
    labeltext: "repository name",
    errortext: "",
    reponame: "",
    repoid: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (!props.add) {
      setFormState({
        ...formstate,
        reponame: props.name,
        permission: props.permission,
        repoid: props.repoid,
      });
    } else {
      setFormState({
        ...formstate,
        reponame: "",
        permission: "PUBLIC",
      });
    }
  // eslint-disable-next-line
  }, [props.open, props.add, props.name, props.permission, props.repoid]);

  const handleChange = (event) => {
    setFormState({
      ...formstate,
      permission: event.target.value,
    });
  };
  const submitForm = () => {
    if (!formstate.reponame) {
      setFormState({
        ...formstate,
        error: true,
        labeltext: "repository name must not be empty",
      });
      return;
    }
    const action = props.add
      ? addrepo(formstate.reponame, formstate.permission)
      : updaterepo(formstate.repoid, formstate.reponame, formstate.permission);
    action
      .then((res) => {
        if (res.status === 200) {
          setFormState({
            ...formstate,
            loading: false,
          });
          return {};
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data.error) {
          setFormState({
            ...formstate,
            errortext: data.error,
          });
        } else {
          props.handleClose();
        }
      });
    setFormState({
      ...formstate,
      loading: true,
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {formstate.loading ? (
        <CircularProgress />
      ) : (
        <div style={getModalStyle()} className={classes.paper}>
          <div>
            {formstate.errortext ? `error: ${formstate.errortext}` : null}
          </div>
          <h2>{props.add ? "Add a Repository" : "Edit Repository"}</h2>
          <form className={classes.form}>
            <FormControl
              style={{ paddingBottom: "20px" }}
              error={formstate.error}
            >
              <InputLabel>{formstate.labeltext}</InputLabel>
              <Input
                defaultValue={formstate.reponame}
                onChange={(e) => {
                  setFormState({
                    ...formstate,
                    reponame: e.target.value,
                  });
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Permissions</FormLabel>
              <RadioGroup value={formstate.permission} onChange={handleChange}>
                <FormControlLabel
                  value="PUBLIC"
                  control={<Radio />}
                  label="public"
                />
                <FormControlLabel
                  value="FRIENDSONLY"
                  control={<Radio />}
                  label="friends only"
                />
                <FormControlLabel
                  value="PRIVATE"
                  control={<Radio />}
                  label="private"
                />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" onClick={submitForm} color="primary">
              {props.add ? "Add" : "Save"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
