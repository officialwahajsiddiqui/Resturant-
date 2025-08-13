import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminBooking = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch bookings when component mounts
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchBookings();
    }
  }, [isAuthenticated, isAdmin]);

  // Fetch all bookings
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/booking', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // Search bookings
  const searchBookings = async () => {
    if (!searchQuery.trim()) {
      fetchBookings();
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/booking/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error searching bookings:', err);
      setError('Search failed. Please try again.');
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchBookings();
  };

  // Delete booking
  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/booking/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Remove deleted booking from state
      setBookings(bookings.filter(booking => booking._id !== id));

      // Show success message
      showAlert('success', 'Booking deleted successfully');
      toast.success('Booking deleted successfully');
    } catch (err) {
      console.error('Error deleting booking:', err);
      showAlert('danger', 'Failed to delete booking');
      toast.error('Failed to delete booking');
    }
  };

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-xxl py-5">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h5 className="section-title ff-secondary text-center text-primary fw-normal">
            Admin Dashboard
          </h5>
          <h1 className="mb-5">Booking Management</h1>

          {/* Admin Navigation */}
          <div className="row mb-4">
            <div className="col-md-6 offset-md-3">
              <div className="d-flex justify-content-center gap-3">
                <a href="/admin/contact" className="btn btn-outline-primary">Contact Management</a>
                <a href="/admin/booking" className="btn btn-primary">Booking Management</a>
              </div>
            </div>
          </div>
        </div>

        {/* Alert message */}
        {alert.show && (
          <div className={`alert alert-${alert.type} text-center`}>
            {alert.message}
          </div>
        )}

        {/* Search form */}
        <div className="row mb-4">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn btn-primary" type="submit">
                  <i className="fa fa-search"></i> Search
                </button>
                {searchQuery && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      fetchBookings();
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Bookings list */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No bookings found.</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Date & Time</th>
                      <th>People</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="booking-row"
                      >
                        <td>{booking.name}</td>
                        <td>{booking.email}</td>
                        <td>{formatDate(booking.datetime)}</td>
                        <td>{booking.people}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            data-bs-toggle="modal"
                            data-bs-target={`#viewModal-${booking._id}`}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteBooking(booking._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>

                          {/* View Modal */}
                          <div className="modal fade" id={`viewModal-${booking._id}`} tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                  <h5 className="modal-title">Booking Details</h5>
                                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                  <div className="mb-3">
                                    <strong>Name:</strong> {booking.name}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Email:</strong> {booking.email}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Date & Time:</strong> {formatDate(booking.datetime)}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Number of People:</strong> {booking.people}
                                  </div>
                                  {booking.message && (
                                    <div className="mb-3">
                                      <strong>Special Request:</strong>
                                      <p className="mt-2 p-3 bg-light rounded">{booking.message}</p>
                                    </div>
                                  )}
                                  <div className="mb-3">
                                    <strong>Booking Created:</strong> {formatDate(booking.createdAt)}
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooking;