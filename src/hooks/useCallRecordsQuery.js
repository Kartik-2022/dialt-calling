// src/hooks/useCallRecordsQuery.js
import { useQuery } from '@tanstack/react-query';
import { fetchActivityLogs } from '../api/callRecords'; 
import { useAuth } from '../context/AuthContext'; 

export const useCallRecords = (filters) => {
  const { logout } = useAuth(); 

  return useQuery({

    queryKey: ['callRecords', filters],
    queryFn: async () => {
      try {
        const data = await fetchActivityLogs(filters);
        return data;
      } catch (error) {
        if (error.message.includes("Authentication token not found")) {
          console.error("Token invalid, logging out:", error);
          logout(); 
        }
        throw error; 
      }
    },
    enabled: true, 
  });
};
