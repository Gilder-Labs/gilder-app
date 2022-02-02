import realmsMainnet from "../constants/realms/mainnet-beta.json";

// cleans realm data from governance ui repo
export const cleanRealmData = () => {
  let realmsData = {};

  realmsMainnet.map((realm) => {
    // @ts-ignore
    realmsData[`${realm.realmId}`] = realm;
  });

  return realmsData;
};
