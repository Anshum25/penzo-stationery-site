// Demo photography from Unsplash (free licence). Replace with the client's own product photos.
export function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const photos = {
  heroMain: "1501618669935-18b6ecb13d6d",
  heroNib: "1457298483369-0a95d2b17fcd",
  heroNotebooks: "1601001435957-74f0958a93fb",
  desk: "1621413268056-ce8911fe1563",
  pencils: "1787580116825-2e83592457ad",
  painting: "1510832842230-87253f48d74f",
  planning: "1513128034602-7814ccaddd4e",
  gift: "1668463876833-339717e58c4c",
} as const;
