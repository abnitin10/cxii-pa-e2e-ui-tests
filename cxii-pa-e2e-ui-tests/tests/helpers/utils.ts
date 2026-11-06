/**
 * Recursively extracts URLs ending with 'chrome-extension-*.zip' from a nested object.
 *
 * @param obj - The input object to search through.
 * @returns An array of matching URLs.
 */
export function extractChromeExtensionUrls(obj: any): string[] {
  let urls: string[] = [];

  // Iterate over each key in the object
  for (const key in obj) {
    const value = obj[key];

    // Check if the value is a string that starts with 'http' and matches the desired pattern
    if (
      typeof value === 'string' &&
      value.startsWith('http') &&
      /chrome-extension-.(?!.*releaseMetadata).*\.zip$/.test(value)
    ) {
      urls.push(value); // Add the matching URL to the array
    }
    // If the value is an object, recursively search within it
    else if (typeof value === 'object' && value !== null) {
      urls = urls.concat(extractChromeExtensionUrls(value));
    }
  }

  return urls;
}
