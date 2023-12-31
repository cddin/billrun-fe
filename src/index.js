import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Routes from "./routes";
import configureStore from "./configureStore";
import * as serviceWorker from "./serviceWorker";
import { GoogleOAuthProvider } from "@react-oauth/google";
/* Styles */
import "react-bootstrap-multiselect/css/bootstrap-multiselect.css";
import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import "font-awesome/css/font-awesome.min.css";
import "./styles/css/normalize.css";
import "./styles/css/sb-admin-2.css";
import "./styles/css/yeti.css";
import "./styles/scss/index.scss";
import "./styles/css/index.css";
import "./styles/css/Dashboard.css";

const DevTools = lazy(() => import("./components/DevTools"));

const store = configureStore();

ReactDOM.render(
  <GoogleOAuthProvider clientId="193798058104-2l923jn7dqgedi3ahjkqnr47ecsbg3v3.apps.googleusercontent.com">
    <Provider store={store}>
      <Routes />
      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={<div>Loading...</div>}>
          <DevTools />
        </Suspense>
      )}
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
