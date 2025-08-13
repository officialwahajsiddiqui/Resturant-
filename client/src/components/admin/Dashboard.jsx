import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
    const { isAuthenticated, user, loading, isAdmin } = useContext(AuthContext);

    // Redirect if not authenticated or not admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
        return <Navigate to="/login" />;
    }

    // Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-5">
            <div className="container">
                {/* Admin Dashboard Header */}
                <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                    <h5 className="section-title ff-secondary text-center text-primary fw-normal">Admin Panel</h5>
                    <h1 className="mb-5">Dashboard</h1>
                </div>

                {/* Admin Navigation */}
                {/* <div className="row mb-5">
                    <div className="col-12">
                        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
                            <div className="container-fluid">
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#adminNavbar"
                                    aria-controls="adminNavbar"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="adminNavbar">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/admin/dashboard">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/contact">
                                                Contact Management
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin/booking">
                                                Booking Management
                                            </Link>
                                        </li>
                                    </ul>
                                    <span className="navbar-text text-light">
                                        Welcome, {user?.name || 'Admin'}
                                    </span>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div> */}

                {/* Dashboard Cards */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <motion.div
                            className="card bg-primary text-white"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="card-body d-flex align-items-center p-4">
                                <FaCalendarAlt className="me-3" size={40} />
                                <div>
                                    <h5 className="card-title mb-0">Bookings</h5>
                                    <p className="card-text mt-2 mb-0">Manage restaurant reservations</p>
                                    <Link to="/admin/booking" className="btn btn-light btn-sm mt-3">
                                        View Bookings
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-4">
                        <motion.div
                            className="card bg-success text-white"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="card-body d-flex align-items-center p-4">
                                <FaUsers className="me-3" size={40} />
                                <div>
                                    <h5 className="card-title mb-0">Contacts</h5>
                                    <p className="card-text mt-2 mb-0">Manage contact submissions</p>
                                    <Link to="/admin/contact" className="btn btn-light btn-sm mt-3">
                                        View Contacts
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-4">
                        <motion.div
                            className="card bg-warning text-dark"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className="card-body d-flex align-items-center p-4">
                                <FaChartLine className="me-3" size={40} />
                                <div>
                                    <h5 className="card-title mb-0">Analytics</h5>
                                    <p className="card-text mt-2 mb-0">View restaurant statistics</p>
                                    <button className="btn btn-dark btn-sm mt-3" disabled>
                                        Coming Soon
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Quick Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="d-grid">
                                            <Link to="/admin/booking" className="btn btn-outline-primary">
                                                View All Bookings
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-grid">
                                            <Link to="/admin/contact" className="btn btn-outline-success">
                                                View All Contacts
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;