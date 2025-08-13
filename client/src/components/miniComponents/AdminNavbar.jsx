import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import './Navbar.css';
import './AdminNavbar.css';
import { FaUserCircle, FaUser, FaCog, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';
import useResponsive from '../../hooks/useResponsive';
import React, { useContext, useEffect, useRef, useState } from 'react';

const AdminNavbar = () => {
    const { isAuthenticated, user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const dropdownRef = useRef(null);
    const { isMobile, isTablet } = useResponsive();

    // Handle clicks outside the profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close navbar when clicking a link on mobile
    const handleNavLinkClick = () => {
        if (isMobile || isTablet) {
            setIsNavCollapsed(true);
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfileDropdown(false);
        navigate('/');
    };

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };
    return (
        <>
            <div className="container-xxl position-relative p-0 ">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0 admin-navbar">
                    <Link to='/admin/dashboard' className="navbar-brand p-0">
                        <h1 className="text-primary m-0">
                            <i className="fa fa-utensils me-3" />
                            Admin Panel
                        </h1>
                        {/* <img src="img/logo.png" alt="Logo"> */}
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                        aria-controls="navbarCollapse"
                        aria-expanded={!isNavCollapsed}
                        aria-label="Toggle navigation"
                    >
                        {isNavCollapsed ? <FaBars /> : <FaTimes />}
                    </button>
                    <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarCollapse">
                        <div className="navbar-nav ms-auto py-0 pe-4">
                            <Link to='/admin/dashboard' className="nav-item nav-link active" onClick={handleNavLinkClick}>
                                Admin Home
                            </Link>
                            <Link to='/admin/contact' className="nav-item nav-link " onClick={handleNavLinkClick}>
                                Contacts
                            </Link>
                            <Link to='/admin/booking' className="nav-item nav-link" onClick={handleNavLinkClick}>
                                Bookings
                            </Link>
                            <div className="nav-item dropdown">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Menu Management
                                </a>
                                <div className="dropdown-menu m-0">
                                    <Link to='/admin/all-menus' className="dropdown-item" onClick={handleNavLinkClick}>
                                        All Menu Items
                                    </Link>
                                    <Link to='/admin/add-menu' className="dropdown-item" onClick={handleNavLinkClick}>
                                        Add New Menu Item
                                    </Link>
                                </div>
                            </div>
                           
                            {/* <Link to='/service' className="nav-item nav-link" onClick={handleNavLinkClick}>
                Service
              </Link>
              <Link to='/menu' className="nav-item nav-link" onClick={handleNavLinkClick}>
                Menu
              </Link> */}
                            {isMobile || isTablet ? (
                                // Simplified dropdown for mobile
                                <>
                                    {/* <Link to='/booking' className="nav-item nav-link" onClick={handleNavLinkClick}>
                    Booking
                  </Link>
                  <Link to='/team' className="nav-item nav-link" onClick={handleNavLinkClick}>
                    Our Team
                  </Link>
                  <Link to='/testimonial' className="nav-item nav-link" onClick={handleNavLinkClick}>
                    Testimonial
                  </Link> */}
                                </>
                            ) : (
                                // Regular dropdown for desktop
                                <div className="nav-item dropdown">
                                    {/* <Link to='#'
                                        className="nav-link dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                    >
                                        Pages
                                    </Link>
                                    <div className="dropdown-menu m-0">
                                        <Link to='/booking' className="dropdown-item">
                                            Booking
                                        </Link>
                                        <Link to='/team' className="dropdown-item">
                                            Our Team
                                        </Link>
                                        <Link to='/testimonial' className="dropdown-item">
                                            Testimonial
                                        </Link>
                                    </div> */}
                                </div>
                            )}
                            {/* <Link to='/Contact' className="nav-item nav-link" onClick={handleNavLinkClick}>
                                Contact
                            </Link> */}
                        </div>
                        {isAuthenticated ? (
                            <div className={`position-relative ${isMobile || isTablet ? 'mobile-profile' : ''}`} style={{ marginRight: '1rem' }} ref={dropdownRef}>
                                <button
                                    className="btn profile-button d-flex align-items-center"
                                    onClick={() => {
                                        toggleProfileDropdown();
                                        if (isMobile || isTablet) {
                                            setIsNavCollapsed(true); // Close navbar when opening profile on mobile
                                        }
                                    }}
                                >
                                    <div className="profile-icon">
                                        <FaUserCircle size={20} />
                                    </div>
                                </button>
                                {showProfileDropdown && (
                                    <div className={`position-absolute end-0 mt-2 profile-dropdown ${isMobile || isTablet ? 'mobile-dropdown' : ''}`} style={{ minWidth: '280px', zIndex: 1000 }}>
                                        <div className="profile-header">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="profile-icon">
                                                    <FaUserCircle size={24} />
                                                </div>
                                                <div>
                                                    <div className="profile-name">{user?.name}</div>
                                                    <div className="profile-email">{user?.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="profile-dropdown-item text-decoration-none"
                                                onClick={() => setShowProfileDropdown(false)}
                                            >
                                                <FaUser /> Profile Settings
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="profile-dropdown-item text-decoration-none"
                                                onClick={() => setShowProfileDropdown(false)}
                                            >
                                                <FaCog /> Account Settings
                                            </Link>
                                            {isAdmin && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className="profile-dropdown-item text-decoration-none"
                                                    onClick={() => setShowProfileDropdown(false)}
                                                >
                                                    <FaShieldAlt /> Admin Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="profile-dropdown-item w-100 text-start border-0 bg-transparent"
                                            >
                                                <FaSignOutAlt className="logout-icon" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to='/login' className="btn btn-primary py-2 px-4 me-3">
                                Login
                            </Link>
                        )}

                    </div>
                </nav>

            </div>
        </>
    )
}

export default AdminNavbar
