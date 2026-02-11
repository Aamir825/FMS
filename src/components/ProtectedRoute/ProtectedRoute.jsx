import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const adminsUID = localStorage.getItem("adminsUID");
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminsUID) {
      navigate('/login');
    }
    }, [adminsUID]);
    return <>{children}</>
}

export default ProtectedRoute