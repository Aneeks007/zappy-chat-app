import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CometChatUIKit, UIKitSettingsBuilder } from "@cometchat/chat-uikit-react";
import App from "./App";
import { setupLocalization } from "./CometChat/utils/utils";
import cometChatLogo from "./CometChat/assets/cometchat_logo.svg";
import { CometChatProvider } from "./CometChat/context/CometChatContext";

// ✅ Fix: Dynamic viewport height for mobile
const setRealVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};
window.addEventListener("resize", setRealVH);
setRealVH(); // run on load

const COMETCHAT_CONSTANTS = {
  APP_ID: "277220fd8655d51c",
  REGION: "in",
  AUTH_KEY: "4b4d37c68b34a8bb44a3738023acac08c09ab2c4",
};

if (
  COMETCHAT_CONSTANTS.APP_ID &&
  COMETCHAT_CONSTANTS.REGION &&
  COMETCHAT_CONSTANTS.AUTH_KEY
) {
  const uiKitSettings = new UIKitSettingsBuilder()
    .setAppId(COMETCHAT_CONSTANTS.APP_ID)
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
    .subscribePresenceForAllUsers()
    .build();

  CometChatUIKit.init(uiKitSettings).then(() => {
    setupLocalization();

    const root = ReactDOM.createRoot(
      document.getElementById("root") as HTMLElement
    );

    root.render(
      <BrowserRouter>
        <CometChatProvider>
          <App />
        </CometChatProvider>
      </BrowserRouter>
    );
  });
} else {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  root.render(
    <div className="App" style={{ gap: "20px" }}>
      <div className="cometchat-credentials__logo">
        <img src={cometChatLogo} alt="CometChat Logo" />
      </div>
      <div className="cometchat-credentials__header">
        CometChat App credentials are missing. Please add them in{" "}
        <code>index.tsx</code> to continue.
      </div>
    </div>
  );
}
