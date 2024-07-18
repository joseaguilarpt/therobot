import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import lodash from "lodash";
import { useMutation } from "@tanstack/react-query";
import AutoSuggest, { AutoSuggestProps } from "../AutoSuggest/AutoSuggest";
import { SEARCH_LOCATION, searchLocationQuery } from "~/api/queries";
import { queryClient } from "~/root";
import { getUserLocation } from "~/utils/userGeoLocations";
import { getItem, setItem } from "~/utils/localStorageUtils";
import { isOlderThanDate } from "~/utils/dateUtils";

const clientCountryBounds = {
  minLat: 8.03,
  maxLat: 11.22,
  minLon: -85.95,
  maxLon: -82.55,
};

const clientDefaultCoords = {
  latitude: 9.9357,
  longitude: -84.082,
};

export function InputSearchLocation({
  onChange,
  value,
  ...rest
}: AutoSuggestProps) {
  const parseDetails = (v: number) => {
    switch (true) {
      case v >= 5 && v <= 9:
        return "Provincia";
      case v >= 10 && v <= 12:
        return "Canton";
      case v >= 13 && v <= 16:
        return "Ciudad";
      case v >= 17 && v <= 18:
        return "Distrito";
      case v === 19:
        return "Barrio o comunidad";
      case v === 20:
        return "Localidad";
      default:
        return "";
    }
  };

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const queryRef = useRef<string>("");

  const isOutsideBounds = (lat: number, lng: number) => {
    const { minLat, maxLat, minLon, maxLon } = clientCountryBounds;
    return lat < minLat || lat > maxLat || lng < minLon || lng > maxLon;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (params: any) => {
      return queryClient.fetchQuery(searchLocationQuery({ params }));
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [SEARCH_LOCATION],
      });
      const result = data
        .map((item: any) => ({
          ...item,
          id: item.place_id,
          label: item.display_name,
          details: parseDetails(item.place_rank),
        }))

      if (result.length) {
        setOptions(result);
      }
    },
    onError: () => {},
  });

  const handleSubmit = async (q: string) => {
    let params: { [key: string]: any } = { q, radius: 40, limit: 10 };
    try {
      const geo = getItem("geo");
      if (
        geo &&
        !isOlderThanDate(geo.timestamp, { time: 1, measure: "week" })
      ) {
        if (!isOutsideBounds(geo.coords.latitude, geo.coords.longitude)) {
          params = {
            ...params,
            latitude: geo.coords.latitude,
            longitude: geo.coords.longitude,
          };
        } else {
          params = {
            ...params,
            ...clientDefaultCoords,
          };
        }
      } else {
        const userGeo = await getUserLocation();
        if (
          !isOutsideBounds(userGeo.coords.latitude, userGeo.coords.longitude)
        ) {
          params = {
            ...params,
            latitude: userGeo.coords.latitude,
            longitude: userGeo.coords.longitude,
          };
        } else {
          params = {
            ...params,
            ...clientDefaultCoords,
          };
        }
        setItem("geo", userGeo);
      }
    } finally {
      setIsLoading(false);
      const url = new URLSearchParams("");
      Object.entries(params).forEach(([key, value]) => url.append(key, value));
      mutate(url);
    }
  };

  const debouncedHandleSubmit = useRef(
    lodash.debounce((q: string) => {
      handleSubmit(q);
    }, 1001)
  ).current;

  useEffect(() => {
    if (query) {
      queryRef.current = query;
    debouncedHandleSubmit(queryRef.current);
    }
  }, [query]);

  const handleChange = (v: any) => {
    setQuery(v);
    if (onChange) {
      onChange(v);
    }
  };

  return (
    <AutoSuggest
      {...rest}
      filterData={false}
      value={value?.display_name}
      onChange={handleChange}
      onQueryChange={(v) => {
        setIsLoading(true);
        setQuery(v);
      }}
      isLoading={isLoading || isPending}
      options={options}
    />
  );
}
