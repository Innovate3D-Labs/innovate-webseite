// Hilfsfunktionen für JSON-Felder in SQLite

export function parseImages(imagesString: string): string[] {
  try {
    return JSON.parse(imagesString) || [];
  } catch {
    return [];
  }
}

export function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}

export function parsePermissions(permissionsString: string): string[] {
  try {
    return JSON.parse(permissionsString) || [];
  } catch {
    return [];
  }
}

export function stringifyPermissions(permissions: string[]): string {
  return JSON.stringify(permissions);
}