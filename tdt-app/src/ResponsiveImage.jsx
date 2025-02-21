import { useState, useEffect } from "react";
const ResponsiveImage = ({ imageKey, alt }) => {
  const url = import.meta.env.VITE_IMAGES_URL;
  const placeholder = url + imageKey + "?size=placeholder";
  const src = url + imageKey + "?size=full";
  const smallSrc = url + imageKey + "?size=small";
  const mediumSrc = url + imageKey + "?size=medium";
  const largeSrc = url + imageKey + "?size=large";
  const srcset =
    smallSrc + " 120w, " + mediumSrc + " 360w, " + largeSrc + " 720w";
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.srcset = srcset;
    img.sizes = "(max-width: 600px) 100vw";
    img.onload = () => {
      setImageSrc(img.currentSrc);
    };
  }, [src, srcset]);

  const blurClass =
    placeholder && imageSrc === placeholder ? "loading-img" : "loaded-img";

  return (
    <img
      src={imageSrc}
      alt={alt}
      sizes="(max-width: 600px) 100vw"
      srcSet={srcset}
      loading="lazy"
      className={blurClass}
    />
  );
};

export default ResponsiveImage;
