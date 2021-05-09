import { createContext, useReducer } from "react";

let uri = "";
if (window.location.port === "3000") {
  // in development port 4000 is backend default port
  uri = "http://localhost:4000";
}

const initialState = {
  isAuthenticated: false,
  username: "",
  userid: null,
  uri,
};

const Context = createContext(initialState);
const { Provider } = Context;

export const AppContextProvider = ({ children, ...services }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Provider value={{ ...state, ...services, dispatch }}>{children}</Provider>
  );
};

export default Context;
