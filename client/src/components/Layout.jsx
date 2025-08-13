import React from 'react'
import Navbar from './miniComponents/Navbar'
import Footer from './miniComponents/Footer'

const Layout = ({ children }) => {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

        {children}

      <Footer />

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up" />
      </a>

    </div>
  )
}

export default Layout