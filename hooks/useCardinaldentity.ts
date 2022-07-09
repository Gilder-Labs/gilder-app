import { useEffect, useState } from "react";
import { tryGetName } from "@cardinal/namespaces";
import { PublicKey, Connection } from "@solana/web3.js";
import { INDEX_RPC_CONNECTION } from "../constants/Solana";
import axios from "axios";

const indexConnection = new Connection(INDEX_RPC_CONNECTION, "recent");

// add caching

const cache: Record<string, any> = {};

export const useCardinalIdentity = (walletId: string) => {
  const [twitterURL, setTwitterURL] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  useEffect(() => {
    const getTwitterIdentity = async () => {
      const walletKey = new PublicKey(walletId);
      const cardinalData = await tryGetName(indexConnection, walletKey);

      const handle = cardinalData?.[0];
      cache[walletId] = { twitterURL: "", twitterHandle: cardinalData?.[0] };

      if (handle) {
        setTwitterHandle(cardinalData?.[0]);
        const handleFormatted = handle.slice(1);

        const response = await axios.get(
          `https://api.cardinal.so/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handleFormatted}&user.fields=profile_image_url`
        );
        const twitterImage = response?.data?.data[0]?.profile_image_url;
        cache[walletId] = { twitterURL: twitterImage, twitterHandle: handle };

        setTwitterURL(twitterImage);
      }
    };

    // if we already cached cardinal wallet, just return that data
    if (cache[walletId]?.twitterHandle) {
      setTwitterURL(cache[walletId].twitterURL);
      setTwitterHandle(cache[walletId].twitterHandle);
    } else if (walletId && !cache[walletId]) {
      // we haven't checked their identity yet
      getTwitterIdentity();
    }
  }, [walletId]);

  return [twitterURL, twitterHandle];
};
