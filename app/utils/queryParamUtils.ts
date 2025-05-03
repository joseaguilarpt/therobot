export function parseQueryParams(searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  const queryParams: Record<string, string> = {};

  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
}

export const encodeSearch = (formData: any, restart?: boolean) => {
  const params: any = {
    radius: "40",
    ...formData,
  };

  const url = new URLSearchParams("");
  Object.entries(params).forEach(([key, value]) => {
    if (key === 'location') {
        const lat = value.lat ?? '';
        const lng = value.lon ?? '';
        const location = value?.name ?? value.display_name ?? '';
        url.append('lat', lat);
        url.append('lng', lng);
        url.append('location', location);

    }
    else if ((typeof value === 'string')) {
      if (value !== '') {
        url.append(key, value);
      }
      return;
    }
    else if (typeof value === "object") {
      const data = value?.value ?? value?.display_name ?? value?.id ?? value?.label ?? "";
      url.append(key, data);
    } else {
      url.append(key, value);
    }
  });
  if (restart) {
    url.delete('page');
  }
  return url.toString();
};
