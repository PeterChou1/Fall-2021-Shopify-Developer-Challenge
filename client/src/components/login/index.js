import React, { useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Context from "../../context";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { useHistory } from "react-router";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles({
  root: {
    minWidth: 300,
    padding: "50px",
  },
  loginbutton: {
    padding: "25px",
  },
  textField: {
    width: "25ch",
  },
});

export default function Login() {
  // dependency injection factory service
  const { authFactoryService, dispatch } = useContext(Context);
  const history = useHistory();
  const { signin, signup } = authFactoryService();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState({
    login: true,
    showPassword: false,
    error: "",
    password: "",
    username: "",
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const filterErrors = async () => {
    if (!(formState.username && formState.password)) {
      setFormState({
        error: "username or password empty",
        ...formState,
      });
      setOpen(true);
    } else {
      const action = formState.login ? signin : signup;
      const res = await action(formState.username, formState.password);
      const data = await res.json();
      if (res.status === 200) {
        dispatch({
          type: "SET_STATE",
          state: {
            isAuthenticated: true,
            username: data.username,
            userid: data.userid,
          },
        });
        history.push(`/profile/${data.userid}`);
      } else {
        setFormState({
          ...formState,
          error: data.error,
        });
        setOpen(true);
      }
    }
  };

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Paper className={classes.root} elevation={3}>
            <form>
              <Typography variant="h5" gutterBottom>
                {formState.login ? "Login" : "Sign up"}
              </Typography>
              <FormControl className={classes.textField}>
                <InputLabel>username</InputLabel>
                <Input
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      username: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl className={classes.textField}>
                <InputLabel>Password</InputLabel>
                <Input
                  type={formState.showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      password: e.target.value,
                    })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setFormState({
                            ...formState,
                            showPassword: !formState.showPassword,
                          })
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {formState.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div className={classes.loginbutton}>
                <Button
                  variant="contained"
                  onClick={filterErrors}
                  color="primary"
                >
                  {formState.login ? "login" : "signup"}
                </Button>
              </div>
              <div>
                {formState.login
                  ? "Not registered?"
                  : "alread have an account?"}
              </div>
              <div>
                <Button
                  onClick={() =>
                    setFormState({ ...formState, login: !formState.login })
                  }
                >
                  {formState.login ? "Sign up" : "Log in"}
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {formState.error}
        </Alert>
      </Snackbar>
    </div>
  );
}
