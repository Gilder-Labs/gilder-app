export const getColorType = (walletId = "something") => {
  const colorArray = [
    "primary",
    "secondary",
    "aqua",
    "purple",
    "success",
    "error",
    "warning",
    "blue",
  ];

  const seed = walletId.charCodeAt(0);
  const index = seed % (colorArray.length - 1);

  return colorArray[index];
};
