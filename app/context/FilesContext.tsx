import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

interface ConvertedFile {
  status: "processing" | "completed" | "error";
  fileName: string;
  fileSize: number;
  fileUrl?: string;
}

interface FilesContextProps {
  convertedFiles: ConvertedFile[];
  setConvertedFiles: Dispatch<SetStateAction<ConvertedFile[]>>;
}

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const value = useMemo(
    () => ({
      convertedFiles,
      setConvertedFiles,
    }),
    [setConvertedFiles, convertedFiles]
  );

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
};

export const useFiles = (): FilesContextProps => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};
