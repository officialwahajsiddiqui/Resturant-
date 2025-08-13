import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import './Admin.css';

const Admin = () => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch contacts when component mounts
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchContacts();
    }
  }, [isAuthenticated, isAdmin]);

  // Fetch all contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/contact', {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Search contacts
  const searchContacts = async () => {
    if (!searchQuery.trim()) {
      fetchContacts();
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/contact/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error('Error searching contacts:', err);
      setError('Search failed. Please try again.');
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
    searchContacts();
  };

  // Delete contact
  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      // Remove deleted contact from state
      setContacts(contacts.filter(contact => contact._id !== id));

      // Show success message
      showAlert('success', 'Contact deleted successfully');
    } catch (err) {
      console.error('Error deleting contact:', err);
      showAlert('danger', 'Failed to delete contact');
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
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h5 className="section-title ff-secondary text-center text-primary fw-normal">
            Admin Dashboard
          </h5>
          <h1 className="mb-5">Contact Form Submissions</h1>

          {/* Admin Navigation */}
          <div className="row mb-4">
            <div className="col-md-6 offset-md-3">
              <div className="d-flex justify-content-center gap-3">
                <a href="/admin" className="btn btn-primary">Contact Management</a>
                <a href="/admin/booking" className="btn btn-outline-primary">Booking Management</a>
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
                      fetchContacts();
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Contacts list */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No contact submissions found.</p>
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
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <motion.tr
                        key={contact._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="contact-row"
                      >
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.subject}</td>
                        <td>{formatDate(contact.createdAt)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info me-2"
                            data-bs-toggle="modal"
                            data-bs-target={`#viewModal-${contact._id}`}
                          >
                            <i className="fa fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteContact(contact._id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>

                          {/* View Modal */}
                          <div className="modal fade" id={`viewModal-${contact._id}`} tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                  <h5 className="modal-title">Contact Details</h5>
                                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                  <div className="mb-3">
                                    <strong>Name:</strong> {contact.name}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Email:</strong> {contact.email}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Subject:</strong> {contact.subject}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Date:</strong> {formatDate(contact.createdAt)}
                                  </div>
                                  <div className="mb-3">
                                    <strong>Message:</strong>
                                    <p className="mt-2 p-3 bg-light rounded">{contact.message}</p>
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

export default Admin;