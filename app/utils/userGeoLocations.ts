export const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
      }
  
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  