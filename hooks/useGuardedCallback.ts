import { useCallback, useContext } from "react";

export default function useGuardedCallback<TArgs extends Array<any>, TReturn>(
  cb: (...args: TArgs) => TReturn,
  dependencies?: Array<any>
) {
  return useCallback(
    async (...args: TArgs) => {
      try {
        return await cb(...args);
      } catch (e: any) {
        console.log("error", e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies || []
  ) as (...args: TArgs) => Promise<Awaited<TReturn> | void>;
}
