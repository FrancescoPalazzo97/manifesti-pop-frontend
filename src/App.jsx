import { useState } from 'react'
import { BrowserRouter, Route, Routes, route } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
