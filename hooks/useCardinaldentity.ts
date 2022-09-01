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
  const [twitterDescription, setTwitterDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  let userUrl = cache?.[walletId]?.twitterURL;

  useEffect(() => {
    const getTwitterIdentity = async () => {
      const walletKey = new PublicKey(walletId);
      cache[walletId] = {
        twitterURL: undefined,
        twitterHandle: "",
        twitterDescription: "",
      };
      const cardinalData = await tryGetName(indexConnection, walletKey);

      const handle = cardinalData?.[0];
      cache[walletId] = {
        twitterURL: undefined,
        twitterHandle: cardinalData?.[0],
        twitterDescription: "",
      };

      if (handle) {
        setTwitterHandle(cardinalData?.[0]);
        const handleFormatted = handle.slice(1);

        const response = await axios.get(
          `https://api.cardinal.so/namespaces/twitter/proxy?url=https://api.twitter.com/2/users/by&usernames=${handleFormatted}&user.fields=description,profile_image_url`
        );
        const description = response?.data?.data?.[0]?.description;
        const twitterImage = response?.data?.data?.[0]?.profile_image_url;
        cache[walletId] = {
          twitterURL: twitterImage.replace("normal", "400x400"),
          twitterHandle: handleFormatted,
          twitterDescription: description || "",
        };

        setTwitterURL(twitterImage);
        setTwitterDescription(description);
      }
      setIsLoading(false);
    };

    // if we already cached cardinal wallet, just return that data
    if (cache[walletId]?.twitterHandle) {
      setTwitterURL(cache[walletId].twitterURL);
      setTwitterHandle(cache[walletId].twitterHandle);
      setTwitterDescription(cache[walletId].twitterDescription);
    } else if (walletId && cache[walletId]) {
      // do nothing because we are waiting for the request to finish
    } else if (walletId && !cache[walletId]) {
      // we haven't checked their identity yet
      setIsLoading(true);
      getTwitterIdentity();
    }
  }, [walletId, userUrl, isLoading]);

  return { twitterURL, twitterHandle, twitterDescription };
};
