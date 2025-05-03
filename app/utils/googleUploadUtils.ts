export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdTime: string;
}

export interface User {
  access_token: string;
}

export interface GoogleUploadProps {
  sourceFormat: string;
  setLoading: (v: boolean) => void;
  isDisabled?: boolean;
  addFiles: (files: File[]) => void;
}

export const sortFiles = (
  files: GoogleFile[],
  sortBy: string,
  sortOrder: "asc" | "desc" = "asc"
): GoogleFile[] => {
  return [...files].sort((a, b) => {
    let compareResult: number;

    switch (sortBy) {
      case "name":
        compareResult = a.name.localeCompare(b.name);
        break;
      case "creation_date":
        compareResult =
          new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
        break;
      case "file_size":
        compareResult = a.size - b.size;
        break;
      default:
        return 0;
    }

    return sortOrder === "asc" ? compareResult : -compareResult;
  });
};

export const bytesToKilobytes = (bytes: number): number => {
  const kilobytes = bytes / 1024;
  return Math.round(kilobytes * 10) / 10;
};
