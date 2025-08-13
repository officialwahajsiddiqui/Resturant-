import React, { useState, useContext } from 'react'
import HeroSection from './miniComponents/HeroSection'
import PropTypes from 'prop-types'
import { AuthContext } from "../context/AuthContext"
import { Navigate } from 'react-router-dom'
import useResponsive from '../hooks/useResponsive'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useForm } from 'react-hook-form'

const Booking = () => {
    const { isMobile } = useResponsive();
    const { isAuthenticated } = useContext(AuthContext);
    
    // Redirect if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState(null);

    // Initialize form with React Hook Form
    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors, isSubmitting, touchedFields } 
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            datetime: '',
            people: '2',
            message: ''
        }
    });

    // Form submission handler
    const onSubmit = async (formValues) => {
        setBookingError(null);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(formValues)
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                setBookingSuccess(true);
                toast.success('Your booking has been confirmed!');
                
                // Reset form after success
                setTimeout(() => {
                    reset();
                    setBookingSuccess(false);
                }, 3000);
            } else {
                // Show error message
                setBookingError(data.msg || 'Failed to create booking');
                toast.error(data.msg || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setBookingError('Server error. Please try again.');
            toast.error('Server error. Please try again.');
        }
    };
    
    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} />
            <HeroSection heading={'Booking'} breadcrumbLast={'Booking'} />
            {/* Reservation Start */}
            <div className="container-xxl py-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
                <div className="row g-0">
                    <div className={`${isMobile ? 'col-12' : 'col-md-6'} ${isMobile ? 'booking-video-mobile' : ''}`}>
                        <div className="video">
                            <button
                                type="button"
                                className="btn-play"
                                data-bs-toggle="modal"
                                data-src="https://www.youtube.com/embed/DWRcNpR6Kdc"
                                data-bs-target="#videoModal"
                            >
                                <span />
                            </button>
                        </div>
                    </div>
                    <div className={`${isMobile ? 'col-12' : 'col-md-6'} bg-dark d-flex align-items-center`}>
                        <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
                            <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                                Reservation
                            </h5>
                            <h1 className="text-white mb-4">Book A Table Online</h1>
                            {bookingSuccess ? (
                                <div className="alert alert-success" role="alert">
                                    <h4 className="alert-heading">Booking Successful!</h4>
                                    <p>Thank you for your reservation. We will contact you shortly to confirm your booking.</p>
                                </div>
                            ) : bookingError ? (
                                <div className="alert alert-danger" role="alert">
                                    <h4 className="alert-heading">Booking Failed</h4>
                                    <p>{bookingError}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row g-3">
                                        <div className={isMobile ? 'col-12 mb-2' : 'col-md-6'}>
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    id="name"
                                                    placeholder="Your Name"
                                                    {...register('name', { required: 'Name is required' })}
                                                />
                                                <label htmlFor="name">Your Name</label>
                                                {errors.name && (
                                                    <div className="invalid-feedback">{errors.name.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={isMobile ? 'col-12 mb-2' : 'col-md-6'}>
                                            <div className="form-floating">
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    id="email"
                                                    placeholder="Your Email"
                                                    {...register('email', { 
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /\S+@\S+\.\S+/,
                                                            message: 'Email is invalid'
                                                        }
                                                    })}
                                                />
                                                <label htmlFor="email">Your Email</label>
                                                {errors.email && (
                                                    <div className="invalid-feedback">{errors.email.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={isMobile ? 'col-12 mb-2' : 'col-md-6'}>
                                            <div className="form-floating date">
                                                <input
                                                    type="datetime-local"
                                                    className={`form-control ${errors.datetime ? 'is-invalid' : ''}`}
                                                    id="datetime"
                                                    placeholder="Date & Time"
                                                    {...register('datetime', { required: 'Date & Time is required' })}
                                                />
                                                <label htmlFor="datetime">Date &amp; Time</label>
                                                {errors.datetime && (
                                                    <div className="invalid-feedback">{errors.datetime.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={isMobile ? 'col-12 mb-2' : 'col-md-6'}>
                                            <div className="form-floating">
                                                <select
                                                    className={`form-select ${errors.people ? 'is-invalid' : ''}`}
                                                    id="people"
                                                    {...register('people', { required: 'Number of people is required' })}
                                                >
                                                    <option value="1">People 1</option>
                                                    <option value="2">People 2</option>
                                                    <option value="3">People 3</option>
                                                    <option value="4">People 4</option>
                                                    <option value="5">People 5</option>
                                                    <option value="6">People 6+</option>
                                                </select>
                                                <label htmlFor="people">No Of People</label>
                                                {errors.people && (
                                                    <div className="invalid-feedback">{errors.people.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Special Request"
                                                    id="message"
                                                    style={{ height: 100 }}
                                                    {...register('message')}
                                                />
                                                <label htmlFor="message">Special Request</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button
                                                className="btn btn-primary w-100 py-3"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Processing...' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal fade"
                id="videoModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content rounded-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Youtube Video
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            {/* 16:9 aspect ratio */}
                            <div className="ratio ratio-16x9">
                                <iframe
                                    className="embed-responsive-item"
                                    src=""
                                    id="video"
                                    allowFullScreen=""
                                    allowscriptaccess="always"
                                    allow="autoplay"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reservation Start */}
        </>
    )
}

export default Booking
