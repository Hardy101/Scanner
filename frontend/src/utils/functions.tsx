// converting date format to dd-MMM
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const [day, month] = formattedDate.split(" ");

  return { day, month };
};
