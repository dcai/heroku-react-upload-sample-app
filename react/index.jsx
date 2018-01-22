import { AppContainer } from "react-hot-loader";
import ReactDOM from "react-dom";
import React from "react";
import App from "./App.jsx";
import rootReducer from "./reducers.js";
import { compose, applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas.js";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [thunk, sagaMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const defaultStore = {
  ui: {},
  data: {
    counter: 0
  }
};

const store = createStore(
  rootReducer,
  defaultStore,
  composeEnhancers(applyMiddleware.apply(null, middlewares))
);

sagaMiddleware.run(rootSaga);

const domHook = document.getElementById("app");
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    domHook
  );

render(App);

if (module.hot) {
  module.hot.accept("./App.jsx", () => {
    // If use Webpack in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require("./App.jsx").default;

    render(NextApp);
  });
}
