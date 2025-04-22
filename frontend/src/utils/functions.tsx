// Importing necessary libraries
import axios from "axios";

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
export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("/event/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.status;
  } catch (err) {
    console.error("Upload failed:", err);
  }
};
