import React from 'react'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import { DailyView } from './pages/DailyView/DailyView'
import { Sales } from './pages/Sales/Sales'
import { Expenses } from './pages/Expenses/Expenses'
import { GasTracker } from './pages/GasTracker/GasTracker'
import { Loans } from './pages/Loans/Loans'
import Login from './pages/Login/Login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
// import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "",
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "daily",
          element: <DailyView />
        },
        {
          path: "sales",
          element: <Sales />
        },
        {
          path: "expenses",
          element: <Expenses />
        },
        {
          path: "gas",
          element: <GasTracker />
        },
        {
          path: "loans",
          element: <Loans />
        }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
