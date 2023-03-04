export function formatDate(date) {
  const dateTemp = new Date(date);

  const dateFormatted =
    ("0" + dateTemp.getUTCDate()).slice(-2) + "-" +
    ("0" + (dateTemp.getUTCMonth() + 1)).slice(-2) + "-" +
    dateTemp.getUTCFullYear() + " " +
    ("0" + dateTemp.getUTCHours()).slice(-2) + ":" +
    ("0" + dateTemp.getUTCMinutes()).slice(-2) + ":" +
    ("0" + dateTemp.getUTCSeconds()).slice(-2);

  return dateFormatted;
}