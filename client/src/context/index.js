import { createContext, useReducer } from "react";


const initialState = {
  isAuthenticated : false
}

const Context = createContext(initialState);
const { Provider } = Context;

export const AppContextProvider = ({children, ...services}) => {
    const reducer = (state, action) => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{ ...state, ...services, dispatch }}>{children}</Provider>;
};


export default Context;
