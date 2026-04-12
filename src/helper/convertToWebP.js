import imageCompression from "browser-image-compression";

export const convertSingleToWebP = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    fileType: "image/webp",
    useWebWorker: true,
  };

  return await imageCompression(file, options);
};

export const convertMultipleToWebP = async (files) => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    fileType: "image/webp",
    useWebWorker: true,
  };

  return Promise.all(
    Array.from(files).map((file) => imageCompression(file, options))
  );
};
