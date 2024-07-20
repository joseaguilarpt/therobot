import { useMatches } from "@remix-run/react";

export function useNonce() {
  const matches = useMatches();
  const rootMatch = matches.find(match => match.id === "root");
  return rootMatch?.data?.nonce;
}