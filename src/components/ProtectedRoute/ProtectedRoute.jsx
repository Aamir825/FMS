import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const adminUID = localStorage.getItem("adminUID");
  const navigate = useNavigate();
  useEffect(() => {
    if (!adminUID) {
      navigate('/login');
    }
    }, [adminUID]);
    return <>{children}</>
}

export default ProtectedRoute