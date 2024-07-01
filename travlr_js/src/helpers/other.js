function generateMapUrl(query) {
  const prefix = "https://www.google.com/maps/search/?api=1&query=";
  return prefix + encodeURIComponent(query);
}

export {generateMapUrl};