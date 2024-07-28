import jpg from "../../img/formats/jpeg.svg";
import gif from "../../img/formats/gif.svg";
import webp from "../../img/formats/webp.svg";
import png from "../../img/formats/png.svg";
import files from "../../img/formats/file.svg";
import tiff from "../../img/formats/tiff.svg";
import svg from "../../img/formats/svg.svg";
import bmp from "../../img/formats/bmp.svg";
import avif from "../../img/formats/avif.svg";

export const FormatImage = ({ format }: { format: string }) => {
  switch (true) {
    case format.includes("jpg") || format.includes("jpeg"):
      return <img width={35} src={jpg} alt="format jpg" />;
    case format.includes("png"):
      return <img width={35} src={png} alt="format png" />;
    case format.includes("gif"):
      return <img width={35} src={gif} alt="format gif" />;
    case format.includes("webp"):
      return <img width={35} src={webp} alt="format webp" />;
    case format.includes("tiff"):
      return <img width={35} src={tiff} alt="format tiff" />;
    case format.includes("bmp"):
      return <img width={35} src={bmp} alt="format bmp" />;
    case format.includes("svg"):
      return <img width={35} src={svg} alt="format svg" />;
    case format.includes("avif"):
      return <img width={35} src={avif} alt="format avif" />;
    default:
      return <img width={35} src={files} alt="format File" />;
  }
};

