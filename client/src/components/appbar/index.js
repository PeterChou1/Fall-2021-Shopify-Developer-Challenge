import React, { useContext, useEffect } from 'react';
import Context from '../../context';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
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
  const classes = useStyles();
  const history = useHistory();
  const { authFactoryService, dispatch, isAuthenticated } = useContext(Context);
  const { signout, isAuth } = authFactoryService();
  useEffect(() => {
    isAuth().then(res => res.json())
            .then(data => {
              console.log(data);
              dispatch({
                type: 'SET_STATE',
                state: {
                    isAuthenticated : data.auth
                }
              });
    })
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated ? 
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <HomeIcon/>
          </IconButton> : null}
          <Button color="inherit" onClick={() => { history.push('/')}}>Browse</Button>
          <Button color="inherit" onClick={() => {
            if (isAuthenticated) {
              signout()
              dispatch({
                type: 'SET_STATE',
                state: {
                    isAuthenticated : true
                }
              });
            } else {
              history.push('/login')
            }
          }}>
              
              {isAuthenticated ?  "Signout" : "Login or Signup" }</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}