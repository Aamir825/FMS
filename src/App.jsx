import React from 'react'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import { DailyView } from './pages/DailyView/DailyView'
import { Sales } from './pages/Sales/Sales'
import { Expenses } from './pages/Expenses/Expenses'
import { GasTracker } from './pages/GasTracker/GasTracker'
import { Loans } from './pages/Loans/Loans'
// import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <Dashboard/>
        },
        {
          path: "daily",
          element: <DailyView/>
        },
        {
          path: "sales",
          element: <Sales/>
        },
        {
          path: "expenses",
          element: <Expenses/>
        },
        {
          path: "gas",
          element: <GasTracker/>
        },
        {
          path: "loans",
          element: <Loans/>
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
