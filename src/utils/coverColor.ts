const covers = [
  { bg: "#26418A", fg: "#FFF1D2" },
  { bg: "#D6456B", fg: "#FFFFFF" },
  { bg: "#E8A93B", fg: "#1F2430" },
  { bg: "#16254F", fg: "#F2B84B" },
  { bg: "#2A6F4F", fg: "#FFFFFF" },
  { bg: "#7A4E08", fg: "#FFF1D2" },
  { bg: "#3D63C9", fg: "#FFFFFF" },
  { bg: "#F2B84B", fg: "#1F2430" },
];

export function randomColorCover(text: string) {
  let total = 0;
  for (const char of text) total += char.charCodeAt(0);

  return covers[total % covers.length];
}
