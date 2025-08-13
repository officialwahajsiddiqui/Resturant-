import React, { useState } from 'react'
import HeroSection from './miniComponents/HeroSection'
import useResponsive from '../hooks/useResponsive'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'

const Contact = () => {
    const { isMobile, isTablet } = useResponsive();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Initialize form with react-hook-form
    const { 
        register, 
        handleSubmit, 
        formState: { errors }, 
        reset 
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        mode: 'onBlur'
    });
    
    // Show alert message
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        
        // Hide alert after 5 seconds
        setTimeout(() => {
            setAlert({ show: false, type: '', message: '' });
        }, 5000);
    };
    
    // Handle form submission
    const submitForm = async (formData) => {
        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showAlert('success', data.msg);
                reset(); // Reset form using react-hook-form's reset
            } else {
                showAlert('danger', data.msg || 'Something went wrong');
            }
        } catch (error) {
            console.error('Contact form submission error:', error);
            showAlert('danger', 'Server error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <HeroSection heading={'Contact Us'} breadcrumbLast={'Contact'} />

            {/* Contact Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                            Contact Us
                        </h5>
                        <h1 className="mb-5">Contact For Any Query</h1>
                    </div>
                    <div className="row g-4">
                        <div className="col-12">
                            <div className={`row gy-4 ${isMobile ? 'contact-info-mobile' : ''}`}>
                                <div className={isMobile ? 'col-12 mb-3' : 'col-md-4'}>
                                    <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                                        Booking
                                    </h5>
                                    <p>
                                        <i className="fa fa-envelope-open text-primary me-2" />
                                        book@example.com
                                    </p>
                                </div>
                                <div className={isMobile ? 'col-12 mb-3' : 'col-md-4'}>
                                    <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                                        General
                                    </h5>
                                    <p>
                                        <i className="fa fa-envelope-open text-primary me-2" />
                                        info@example.com
                                    </p>
                                </div>
                                <div className={isMobile ? 'col-12 mb-3' : 'col-md-4'}>
                                    <h5 className="section-title ff-secondary fw-normal text-start text-primary">
                                        Technical
                                    </h5>
                                    <p>
                                        <i className="fa fa-envelope-open text-primary me-2" />
                                        tech@example.com
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`${isMobile ? 'col-12' : 'col-md-6'} ${isMobile ? 'mb-4' : ''} wow fadeIn`} data-wow-delay="0.1s">
                            <iframe
                                className="position-relative rounded w-100 h-100"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001156.4288297426!2d-78.01371936852176!3d42.72876761954724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4ccc4bf0f123a5a9%3A0xddcfc6c1de189567!2sNew%20York%2C%20USA!5e0!3m2!1sen!2sbd!4v1603794290143!5m2!1sen!2sbd"
                                frameBorder={0}
                                style={{ minHeight: isMobile ? 250 : 350, border: 0 }}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex={0}
                            />
                        </div>
                        <div className={`${isMobile ? 'col-12' : 'col-md-6'}`}>
                            <div className="wow fadeInUp" data-wow-delay="0.2s">
                                {/* Alert message */}
                                <AnimatePresence>
                                    {alert.show && (
                                        <motion.div 
                                            className={`alert alert-${alert.type} text-center`}
                                            initial={{ opacity: 0, y: -50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -50 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {alert.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                
                                <form onSubmit={handleSubmit(submitForm)}>
                                    <div className="row g-3">
                                        <div className={isMobile ? 'col-12 mb-2' : 'col-md-6'}>
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    id="name"
                                                    placeholder="Your Name"
                                                    {...register('name', { 
                                                        required: 'Name is required' 
                                                    })}
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
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                                    id="subject"
                                                    placeholder="Subject"
                                                    {...register('subject', { 
                                                        required: 'Subject is required',
                                                        maxLength: {
                                                            value: 100,
                                                            message: 'Subject must be less than 100 characters'
                                                        }
                                                    })}
                                                />
                                                <label htmlFor="subject">Subject</label>
                                                {errors.subject && (
                                                    <div className="invalid-feedback">{errors.subject.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea
                                                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                                    placeholder="Leave a message here"
                                                    id="message"
                                                    style={{ height: 150 }}
                                                    {...register('message', { 
                                                        required: 'Message is required',
                                                        maxLength: {
                                                            value: 1000,
                                                            message: 'Message must be less than 1000 characters'
                                                        }
                                                    })}
                                                />
                                                <label htmlFor="message">Message</label>
                                                {errors.message && (
                                                    <div className="invalid-feedback">{errors.message.message}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button 
                                                className="btn btn-primary w-100 py-3" 
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Sending...
                                                    </>
                                                ) : 'Send Message'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact End */}

         


        </>
    )
}

export default Contact
