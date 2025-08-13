import React from 'react'
import AdminNavbar from './miniComponents/AdminNavbar'
import Footer from './miniComponents/Footer'


const AdminLayout = ({ children }) => {
    return (
        <>
            <div className="container-xxl bg-white p-0 navbar-dark bg-dark">
                <AdminNavbar />

                {children}

                <Footer />

                <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
                    <i className="bi bi-arrow-up" />
                </a>
            </div>
        </>
    )
}

export default AdminLayout
