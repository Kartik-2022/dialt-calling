export const errorHandler = (error) => {
  console.error("An error occurred:", error);

};


export const formatDate = (isoString) => {
    if (!isoString || isoString === 'N/A') return 'N/A';
    try {
      const date = new Date(isoString);
      const options = {
        month: 'short', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return isoString; 
    }
  };