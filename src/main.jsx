import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { LanguageProvider } from "./i18n";
import { applyFavicon, applyTheme } from "./theme";
import { profile } from "./constants";
import "./index.css";

applyTheme();
applyFavicon(profile.initials);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
