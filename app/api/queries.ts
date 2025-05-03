import { queryOptions } from "@tanstack/react-query";
import { postData, searchLocation, getSearchResults, getProductById } from "./endpoints";

export const POST_DATA = "postData";
export const SEARCH_RESULTS = "searchResults";
export const SEARCH_LOCATION = "searchLocation";
export const PRODUCT_BY_ID = "getById";

export function postDataQuery({ formData }: { formData: any }) {
  return queryOptions({
    queryKey: [POST_DATA],
    queryFn: async ({ signal }) => postData({ formData, signal }),
    staleTime: 1000 * 6,
  });
}

export function searchLocationQuery({ params }: { params: any }) {
  return queryOptions({
    queryKey: [SEARCH_LOCATION],
    queryFn: async ({ signal }) => searchLocation({ params, signal }),
    staleTime: Infinity,
  });
}


export function getSearchResultsQuery({ params }: { params: any }) {
  return queryOptions({
    queryKey: [SEARCH_RESULTS],
    queryFn: async ({ signal }) => getSearchResults({ params, signal }),
    staleTime: Infinity,
  });
}

export function getProductByIdQuery({ id }: { id: any }) {
  return queryOptions({
    queryKey: [PRODUCT_BY_ID],
    queryFn: async ({ signal }) => getProductById({ id, signal }),
    staleTime: Infinity,
  });
}