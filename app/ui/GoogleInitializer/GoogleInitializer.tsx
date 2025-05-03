import { useEffect, FC } from 'react';

interface GoogleApiInitializerProps {
  clientId: string;
  nonce: string;
  apiKey: string;
}

type TokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (args: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (args: {
            client_id: string;
            scope: string;
            callback: string;
          }) => TokenClient;
        };
      };
    };
    tokenClient: TokenClient;
    pickerInited: boolean;
    gisInited: boolean;
  }
}

export const GoogleApiInitializer: FC<GoogleApiInitializerProps> = ({
  clientId,
  apiKey,
  nonce,
}) => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.async = true;
    script1.defer = true;
    script1.nonce = nonce;
    script1.onload = async () => {
      window.gapi.load('client:picker', async () => {
        await window.gapi.client.init({
          apiKey,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
        });
        window.pickerInited = true;
      });
    };
    script1.onerror = (error: Event | string) => console.error('Error loading GAPI:', error);

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.async = true;
    script2.defer = true;
    script2.nonce = nonce;
    script2.onload = () => {
      window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: '', // defined later
      });
      window.gisInited = true;
    };
    script2.onerror = (error: Event | string) => console.error('Error loading GSI:', error);

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, [clientId, nonce, apiKey]);

  return null;
};