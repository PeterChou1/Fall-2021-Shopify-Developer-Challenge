import React, { useContext, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Context from "../../context";
import Input from "@material-ui/core/Input";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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

export default function ImageModal({
  id,
  add,
  open,
  handleClose,
  imgid,
  description,
  title,
  display,
}) {
  const classes = useStyles();
  const { imageFactoryService, uri } = useContext(Context);
  const { addImage, updateImage } = imageFactoryService();
  const [formstate, setFormState] = useState({
    uploadfile: null,
    serverError: "",
    uploadFileLabel: "",
    descriptionLabel: "description",
    descriptionError: false,
    description: "",
    titleLabel: "title",
    titleError: false,
    title: "",
  });

  const onChangeHandler = (event) => {
    setFormState({
      ...formstate,
      uploadfile: event.target.files[0],
    });
  };
  const submitForm = async () => {
    const validFile = !!formstate.uploadfile;
    const validTitle = !!formstate.title;
    const validDescription = !!formstate.description;
    setFormState({
      ...formstate,
      uploadFileLabel: validFile ? "" : "no file avaliable to post",
      descriptionLabel: validDescription
        ? "description"
        : "description must not be empty",
      titleLabel: validTitle ? "title" : "title must not be empty",
      titleError: !validTitle,
      descriptionError: !validDescription,
    });
    if ((!validFile && add) || !validTitle || !validDescription) return;
    var res;
    if (add) {
      const data = new FormData();
      data.append("repoid", id);
      data.append("description", formstate.description);
      data.append("title", formstate.title);
      data.append("file", formstate.uploadfile);
      res = await addImage(data);
    } else {
      res = await updateImage(imgid, formstate.title, formstate.description);
    }

    if (res.status !== 200) {
      const data = await res.json();
      setFormState({
        ...formstate,
        serverError: data.error,
      });
      return;
    }
    handleClose();
  };

  useEffect(() => {
    setFormState({
      uploadfile: null,
      uploadFileLabel: "",
      descriptionLabel: "description",
      descriptionError: false,
      description: add ? "" : description,
      titleLabel: "title",
      titleError: false,
      title: add ? "" : title,
      serverError: "",
    });
  // eslint-disable-next-line
  }, [open, add]);

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={getModalStyle()} className={classes.paper}>
        {display ? (
          <img
            className={classes.img}
            src={`${uri}/api/images/${imgid}/`}
            alt={title}
          ></img>
        ) : null}
        <h2>{display ? title : add ? "Add Image" : "Edit Image"}</h2>
        <div>{formstate.serverError}</div>
        {display ? (
          <div>
            <Typography variant="h5">{description}</Typography>
          </div>
        ) : (
          <form className={classes.form}>
            <FormControl
              style={{ paddingBottom: "20px" }}
              error={formstate.titleError}
            >
              <InputLabel>{formstate.titleLabel}</InputLabel>
              <Input
                defaultValue={formstate.title}
                onChange={(e) => {
                  setFormState({
                    ...formstate,
                    title: e.target.value,
                  });
                }}
              />
            </FormControl>
            <TextField
              style={{ paddingBottom: "20px" }}
              error={formstate.descriptionError}
              label={formstate.descriptionLabel}
              multiline
              rows={4}
              defaultValue={formstate.description}
              variant="filled"
              onChange={(e) => {
                console.log(e.target.value);
                setFormState({
                  ...formstate,
                  description: e.target.value,
                });
              }}
            />
            {add ? (
              <div>
                <div>{formstate.uploadFileLabel}</div>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={onChangeHandler}
                />
              </div>
            ) : null}
            <Button onClick={submitForm}>{add ? "Post" : "Save"}</Button>
          </form>
        )}
      </div>
    </Modal>
  );
}
