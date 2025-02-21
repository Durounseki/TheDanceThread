import { useState, useEffect } from "react";
const ProgressiveImage = ({ imageKey, alt, size }) => {
  const url = import.meta.env.VITE_IMAGES_URL;
  const placeholder = url + imageKey + "?size=placeholder";
  const src = url + imageKey + `?size=${size ? size : "full"}`;
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
    };
  }, [src]);

  const blurClass =
    placeholder && imageSrc === placeholder ? "loading-img" : "loaded-img";

  return <img src={imageSrc} alt={alt} className={blurClass} loading="lazy" />;
};

export default ProgressiveImage;
