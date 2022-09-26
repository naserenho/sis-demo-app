import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <Layout>
      <App />
    </Layout>
  </Provider>
);
