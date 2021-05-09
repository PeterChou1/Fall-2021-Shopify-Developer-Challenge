import "./App.css";
import { Switch, Route } from "react-router-dom";
import AppBar from "./components/appbar";
import Browse from "./components/browse";
import Login from "./components/login";
import ProfilePage from "./components/profile";
import RepoPage from "./components/repo";

import { AppContextProvider } from "./context";
import authFactory from "./services/auth";
import userFactory from "./services/users";
import repoFactory from "./services/repo";
import imageFactory from "./services/images";

function App() {
  return (
    <div className="App">
      <AppContextProvider
        authFactoryService={authFactory}
        userFactoryService={userFactory}
        repoFactoryService={repoFactory}
        imageFactoryService={imageFactory}
      >
        <AppBar></AppBar>
        <Switch>
          <Route exact path="/" component={Browse}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/profile/:id" component={ProfilePage}></Route>
          <Route exact path="/repo/:id" component={RepoPage}></Route>
        </Switch>
      </AppContextProvider>
    </div>
  );
}

export default App;
