//https://github.com/mixpanel/mixpanel-react-native/blob/master/Samples/ContextAPIMixpanel/Analytics.js

import React, { createContext, useEffect } from "react";
import { Mixpanel } from "mixpanel-react-native";
import Constants from "expo-constants";

let mixpanelInstance: any = null;

if (
  process.env.NODE_ENV !== "development" &&
  Constants?.manifest?.extra?.mixPanelApiKey
) {
  const trackAutomaticEvents = true;
  mixpanelInstance = new Mixpanel(
    Constants?.manifest?.extra?.mixPanelApiKey,
    trackAutomaticEvents
  );
  mixpanelInstance.init();
  mixpanelInstance.setLoggingEnabled(true);
}

export const useAnalytics = () => {
  // const [mixpanel, setMixpanel] = React.useState(null);

  const logEvent = (
    eventName: string = "Default Event",
    eventProperties: any = null
  ) => {
    if (process.env.NODE_ENV !== "development") {
      mixpanelInstance.track(eventName, eventProperties);
    }
  };

  return { logEvent };
};
