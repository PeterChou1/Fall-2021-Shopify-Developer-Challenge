import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInterval } from "../../utils/hooks";
import Context from "../../context";
import ImageModal from "./ImageModal";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

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
  clickAdd: {
    display: "flex",
  },
}));

export default function RepoPage() {
  const { id } = useParams();
  const classes = useStyles();
  const [repostate, setRepoState] = useState({
    images: [],
    name: "",
    count: 0,
    page: 1,
    pagelength: 10,
    ownRepo: false,
  });
  const maxpages =
    repostate.count % repostate.pagelength === 0
      ? repostate.count / repostate.pagelength
      : Math.floor(repostate.count / repostate.pagelength) + 1;

  const [modalstate, setModalState] = useState({
    display: false,
    add: true,
    open: false,
    description: "",
    title: "",
  });
  const { imageFactoryService, uri } = useContext(Context);
  const { getImageRepo, deleteImage } = imageFactoryService();
  const fetchImageRepo = async () => {
    const res = await getImageRepo(
      id,
      repostate.page - 1,
      repostate.pagelength
    );
    const data = await res.json();
    if (res.status === 200) {
      setRepoState({
        ...repostate,
        count: data.count,
        images: data.images,
        name: data.name,
        ownRepo: data.owns,
      });
    } else {
      console.log(data.error);
    }
  };

  const handleModalClose = () => {
    setModalState({
      ...modalstate,
      open: false,
    });
    fetchImageRepo();
  };

  const openAddModal = () => {
    setModalState({
      ...modalstate,
      display: false,
      add: true,
      open: true,
    });
  };

  const openImageModal = (display, imgid, description, title) => {
    setModalState({
      ...modalstate,
      display: display,
      add: false,
      open: true,
      description,
      title,
      imgid,
    });
  };
  const handlePageChange = (_event, value) => {
    setRepoState({
      ...repostate,
      page: value,
    });
    fetchImageRepo();
  };

  useInterval(() => {
    fetchImageRepo();
  }, 10000);
  useEffect(() => {
    fetchImageRepo();
  // eslint-disable-next-line
  }, [repostate.page]);

  return (
    <div>
      <div>
        <h2>{repostate.name}</h2>
      </div>
      <div>
        {repostate.ownRepo ? (
          <div>
            <div>Add Image</div>
            <IconButton onClick={openAddModal}>
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
          {repostate.images.map((img) => {
            const createdAt = img.createdAt.split("T")[0];
            return (
              <GridListTile key={img.id} cols={1} className={classes.gridTile}>
                <img src={`${uri}/api/images/${img.id}/`} alt={img.title}></img>
                <GridListTileBar
                  title={
                    <Button
                      onClick={() => {
                        openImageModal(
                          true,
                          img.id,
                          img.description,
                          img.title
                        );
                      }}
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      {img.title}
                    </Button>
                  }
                  subtitle={<span>created: {createdAt}</span>}
                  actionIcon={
                    repostate.ownRepo ? (
                      <div>
                        <IconButton
                          className={classes.icon}
                          onClick={async () => {
                            const res = await deleteImage(img.id);
                            if (res.status === 200) {
                              fetchImageRepo();
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          className={classes.icon}
                          onClick={() => {
                            openImageModal(
                              false,
                              img.id,
                              img.description,
                              img.title
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
          page={repostate.page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <ImageModal
        id={id}
        add={modalstate.add}
        open={modalstate.open}
        handleClose={handleModalClose}
        description={modalstate.description}
        title={modalstate.title}
        imgid={modalstate.imgid}
        display={modalstate.display}
      ></ImageModal>
    </div>
  );
}
