/**
 * Capitalizes the first letter of a string
 */
export function titleCase(str) {
  const words = str?.split(" ");
  return words?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/**
 * Given a number as a string, adds commas for thousands, millions, etc
 */
export function addCommas(nStr) {
  nStr += "";
  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

/**
 * Prompts user to download a file from the given URL
 */
export function download(e, url) {
  e.preventDefault();
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    });
}

/**
 * Truncate filename in a way that shows file type
 */
export function truncateFileName(name, maxChars) {
  if (name.length < maxChars) {
    return name;
  } else {
    const nameStart = name.slice(0, maxChars / 2);
    const nameEnd = name.slice(name.length - maxChars / 2, name.length);
    return nameStart + "..." + "." + nameEnd;
  }
}
