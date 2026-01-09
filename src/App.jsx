import React from 'react'
import { createBrowserRouter, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import { DailyView } from './pages/DailyView/DailyView'
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
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
