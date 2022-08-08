import nacl from "tweetnacl";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { Keypair } from "@solana/web3.js";
import * as SecureStore from "expo-secure-store";

export const signMessageWithKey = async (message: string) => {
  const privateKey = await SecureStore.getItemAsync("privateKey");
  if (!privateKey) {
    throw Error();
  }
  const walletKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));

  const signedMessage = await nacl.sign(
    Buffer.from(message),
    walletKeypair.secretKey
  );
  return Buffer.from(signedMessage).toString("base64");
};
