import './App.css';
import { Switch, Route } from "react-router-dom";
import AppBar from './components/appbar'
import Browse from './components/browse'
import Login from './components/login'
import Homepage from './components/homepage'
import { AppContextProvider } from './context'
import authFactory from './services/auth';

function App() {
  return (
    <div className="App">
      <AppContextProvider authFactoryService={authFactory}>
        <AppBar></AppBar>
        <Switch>
          <Route exact path="/" component={Browse}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/homepage" component={Homepage}></Route>
        </Switch>
      </AppContextProvider>
    </div>
  );
}

export default App;
