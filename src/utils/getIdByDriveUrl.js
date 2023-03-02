function getIdByDriveUrl({ url }) {
  return url.match(/[-\w]{25,}/);

}

function convertDriveURL({ url }) {
  const id = getIdByDriveUrl({ url });
  return `https://drive.google.com/uc?id=${id}`;
};

export default convertDriveURL;