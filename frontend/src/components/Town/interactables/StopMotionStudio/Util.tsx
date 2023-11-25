export function saveBlob(blob) {
  const bloburl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.cssText = 'display: none';
  a.href = bloburl;

  a.download = 'animation.json';
  a.click();

  URL.revokeObjectURL(bloburl);

  document.body.removeChild(a);
}
