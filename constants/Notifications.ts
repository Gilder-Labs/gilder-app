import Constants from "expo-constants";

export const USE_LOCAL_NOTIFICATION_API =
  Constants?.manifest?.extra?.useLocalNotificationApi;

export const NOTIFICATION_API_URL = USE_LOCAL_NOTIFICATION_API
  ? `http://${Constants.manifest?.debuggerHost?.split(":").shift()}:3001`
  : "https://api.gilder.xyz/notify";
