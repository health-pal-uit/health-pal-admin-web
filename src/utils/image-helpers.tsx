export const getImageUrl = (
  img: string | { url: string } | null | undefined,
): string | null => {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (typeof img === "object" && "url" in img) {
    return (img as { url: string }).url;
  }
  return null;
};
