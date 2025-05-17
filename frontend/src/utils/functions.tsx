// converting date format to dd-MMM
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const [day, month] = formattedDate.split(" ");

  return { day, month };
};

export const fancyDateToday = () => {
  const now = new Date();

  const dayName = now.toLocaleDateString("en-GB", { weekday: "long" });
  const day = now.getDate();
  const month = now.toLocaleDateString("en-GB", { month: "long" });
  const year = now.getFullYear();

  const getOrdinalSuffix = (n: number) => {
    const j = n % 10,
      k = n % 100;
    if (j === 1 && k !== 11) return `${n}st`;
    if (j === 2 && k !== 12) return `${n}nd`;
    if (j === 3 && k !== 13) return `${n}rd`;
    return `${n}th`;
  };

  return {
    dayName,
    fullDate: `${getOrdinalSuffix(day)} ${month} ${year}`,
  };
};

// Function to handle the copy action
export const copyToClipboard = (target: HTMLElement | null): Promise<void> => {
  return new Promise(() => {
    if (target) {
      const textToCopy = target.innerText;
      navigator.clipboard.writeText(textToCopy);
    }
  });
};

// Function to handle file upload

