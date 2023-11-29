// Exporting the function for use in other modules.
export function saveBlob(blob: Blob) {
  // Creating a URL for the blob object.
  const bloburl = URL.createObjectURL(blob);

  // Creating an anchor ('a') element and appending it to the document body.
  const a = document.createElement('a');
  document.body.appendChild(a);
  // Setting the style of the anchor to make it invisible in the document.
  a.style.cssText = 'display: none';
  // Assigning the blob URL to the href attribute of the anchor.
  a.href = bloburl;

  // Setting a default download filename for the blob.
  a.download = 'animation.json';
  // Programmatically clicking the anchor to trigger the file download.
  a.click();

  // Releasing the created blob URL to free up memory.
  URL.revokeObjectURL(bloburl);

  // Removing the anchor from the document body after use.
  document.body.removeChild(a);
}
