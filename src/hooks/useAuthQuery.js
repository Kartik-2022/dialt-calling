// src/hooks/useAuthQuery.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext'; 
import { setToken } from '../http/token-interceptor'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


export const useLogin = () => {
  
  const { setUser } = useAuth(); 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      
      setToken(data.token); 

      
      if (data.user) {
        setUser(data.user); 
      }

      
      queryClient.invalidateQueries({ queryKey: ['callRecords'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      
      navigate('/dashboard');
      toast.success("Logged in successfully!");
    },

    onError: (error) => {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    },
  });
};
