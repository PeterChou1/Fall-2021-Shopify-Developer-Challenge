import React, { useContext, useEffect, useState } from "react";
import Context from "../../context";
import { useParams } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RepoModal from "./RepoModal";
import { useInterval } from "../../utils/hooks";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import Pagination from "@material-ui/lab/Pagination";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
    margin: "50px",
  },
  gridList: {
    width: "100%",
    height: 450,
  },
  gridTile: {
    backgroundColor: "grey",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

export default function ProfilePage() {
  const { id } = useParams();
  const classes = useStyles();
  var profileid = parseInt(id);
  const { userid, repoFactoryService, uri } = useContext(Context);
  const isHomePage = profileid === userid;
  const { getrepo, deleterepo } = repoFactoryService();
  // modal opened variable
  const [modalState, setModalState] = useState({
    open: false,
    add: false,
    preset: {
      permission: null,
      name: "",
    },
  });
  // repository data fetched from backend
  const [repoData, setRepo] = useState({
    count: 0,
    repos: [],
    username: "",
  });
  // pagelength hard coded to be 10 can be optionally refactored to be variable
  const pagelength = 10;
  const maxpages =
    repoData.count % pagelength === 0
      ? repoData.count / pagelength
      : Math.floor(repoData.count / pagelength) + 1;
  const [page, setPage] = useState(1);
  const handlePageChange = (_event, value) => {
    setPage(value);
    fetchRepo();
  };
  const handleOpenAddModal = () => {
    setModalState({
      ...modalState,
      open: true,
      add: true,
    });
  };
  const handleOpenEditModal = (repoid, name, permission) => {
    setModalState({
      open: true,
      add: false,
      preset: {
        repoid,
        name,
        permission,
      },
    });
  };
  const fetchRepo = async () => {
    // -1 for 0 offset
    const res = await getrepo(profileid, page - 1, pagelength);
    const data = await res.json();
    if (res.status === 200) {
      setRepo(data);
    }
  };
  const deleteRepo = async (repoid) => {
    const res = await deleterepo(repoid);
    if (res.status === 200) {
      fetchRepo();
    } else {
      const error = await res.json();
      console.log("delete error");
      console.log(error);
    }
  };
  const handleModalClose = () => {
    /* fetch repositories */
    setModalState({
      ...modalState,
      open: false,
    });
    fetchRepo();
  };
  /* fetch repository every 10 seconds*/
  useInterval(() => {
    if (!isHomePage) {
      fetchRepo();
    }
  }, 10000);

  /*  on Mount fetch repo */
  useEffect(() => {
    fetchRepo();
  // eslint-disable-next-line
  }, [page]);

  return (
    <div>
      <h2>
        {isHomePage
          ? "Your Repositories"
          : `${repoData.username}'s Repositories`}
      </h2>
      <div>
        {isHomePage ? (
          <div>
            <div>Add a repository</div>
            <IconButton color="primary" onClick={handleOpenAddModal}>
              <AddIcon></AddIcon>
            </IconButton>
          </div>
        ) : null}
      </div>
      <div className={classes.root}>
        <GridList
          cellHeight={180}
          spacing={4}
          cols={5}
          className={classes.gridList}
        >
          {repoData.repos.map((repo) => {
            const createdAt = repo.createdAt.split("T")[0];
            return (
              <GridListTile key={repo.id} cols={1} className={classes.gridTile}>
                <img src={`${uri}/api/repo/${repo.id}/`} alt="thumbnail"></img>
                <GridListTileBar
                  title={
                    <Link
                      to={`/repo/${repo.id}`}
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {repo.name}
                    </Link>
                  }
                  subtitle={<span>created: {createdAt}</span>}
                  actionIcon={
                    isHomePage ? (
                      <div>
                        <IconButton
                          className={classes.icon}
                          onClick={async () => {
                            deleteRepo(repo.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          className={classes.icon}
                          onClick={() => {
                            handleOpenEditModal(
                              repo.id,
                              repo.name,
                              repo.permission
                            );
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    ) : null
                  }
                />
              </GridListTile>
            );
          })}
        </GridList>
        <Pagination
          count={maxpages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <RepoModal
        open={modalState.open}
        add={modalState.add}
        handleClose={handleModalClose}
        name={modalState.preset.name}
        permission={modalState.preset.permission}
        repoid={modalState.preset.repoid}
      ></RepoModal>
    </div>
  );
}
