const tutorialHintImages = import.meta.glob(
  "../../../images/**/*.{png,jpg,jpeg,gif,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
) as Record<string, string>;

function normalizeImagePath(imagePath: string): string {
  return imagePath.replace(/\\/g, "/").replace(/^\.\//, "");
}

function toImagesRelativePath(imagePath: string): string {
  const normalized = normalizeImagePath(imagePath);
  return normalized.startsWith("images/")
    ? normalized.slice("images/".length)
    : normalized;
}

function globKeyToImagesRelativePath(key: string): string {
  return key.replace(/\\/g, "/").replace(/^.*\/images\//, "");
}

export function resolveTutorialHintImage(imagePath: string): string | null {
  const relativePath = toImagesRelativePath(imagePath);

  for (const [key, url] of Object.entries(tutorialHintImages)) {
    if (globKeyToImagesRelativePath(key) === relativePath) {
      return url;
    }
  }

  return null;
}
