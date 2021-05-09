import React, { useEffect, useContext, useState } from "react";
import Context from "../../context";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
    margin: "0 auto",
  },
}));

function Item(props) {
  return (
    <Paper elevation={3}>
      <h3>Visit {props.user.username}'s Repositories</h3>
      <AccountCircleIcon></AccountCircleIcon>
      <Link to={`/profile/${props.user.id}`} style={{ textDecoration: "none" }}>
        {props.user.username}
      </Link>
    </Paper>
  );
}

export default function Browse() {
  const { userFactoryService } = useContext(Context);
  const { getusers } = userFactoryService();
  const classes = useStyles();
  const [browseState, setBrowseState] = useState({
    page: 0,
    pagelength: 5,
    data: [],
  });
  useEffect(() => {
    async function fetchuser() {
      const res = await getusers(browseState.page, browseState.pagelength);
      const data = await res.json();
      setBrowseState({
        ...browseState,
        data,
      });
      console.log(data);
    }
    fetchuser();
  // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        <Typography variant="h4">Browse Other People's Repositories</Typography>
      </div>
      <Carousel autoPlay={false} className={classes.root}>
        {browseState.data.map((user, i) => (
          <Item key={i} user={user}></Item>
        ))}
      </Carousel>
    </div>
  );
}
