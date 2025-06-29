export const errorHandler = (error) => {
  console.error("An error occurred:", error);

};


export const formatDate = (isoString) => {
    if (!isoString || isoString === 'N/A') return 'N/A';
    try {
      const date = new Date(isoString);
      const options = {
        month: 'short', // Dec
        day: '2-digit', // 03
        year: 'numeric', // 2024
        hour: '2-digit', // 03
        minute: '2-digit', // 45
        hour12: true // AM/PM
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return isoString; // Return original if format fails
    }
  };