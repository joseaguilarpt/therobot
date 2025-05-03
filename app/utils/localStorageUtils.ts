// utils/localStorageUtils.ts
export const setItem = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  export const getItem = (key: string): any => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  };
  
  export const removeItem = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };
  