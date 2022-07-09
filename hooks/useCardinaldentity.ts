import { useEffect, useState } from "react";
import { tryGetName } from "@cardinal/namespaces";
import { PublicKey, Connection } from "@solana/web3.js";
import { INDEX_RPC_CONNECTION } from "../constants/Solana";
import axios from "axios";

const indexConnection = new Connection(INDEX_RPC_CONNECTION, "recent");

// add caching
export const useCardinalIdentity = (walletId: string) => {
  const [twitterURL, setTwitterURL] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  useEffect(() => {
    const getTwitterIdentity = async () => {
      const cardinalData = await tryGetName(
        indexConnection,
        new PublicKey(walletId)
      );

      const handle = cardinalData?.[0];

      if (!twitterURL && handle) {
        setTwitterHandle(cardinalData?.[0]);
        const handleFormatted = handle.slice(1);

        const response = await axios.get(
          `https://api.cardinal.so/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handleFormatted}&user.fields=profile_image_url`
        );
        const twitterImage = response?.data?.data[0]?.profile_image_url;
        setTwitterURL(twitterImage);
      }
    };

    if (walletId) {
      getTwitterIdentity();
    }
  }, [walletId]);

  return [twitterURL, twitterHandle];
};
