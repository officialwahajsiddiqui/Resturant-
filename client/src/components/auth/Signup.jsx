import { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated, loading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }



  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };



  const onSubmit = async (data) => {
    const userData = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    
    const success = await registerUser(userData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {authError && <div className="auth-error">{authError}</div>}
          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className={errors.name ? 'error' : ''}
                {...register("name", { 
                  required: "Name is required"
                })}
              />
            </div>
            {errors.name && <div className="error-message">{errors.name.message}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className={errors.email ? 'error' : ''}
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { 
                    value: /\S+@\S+\.\S+/, 
                    message: "Email is invalid" 
                  } 
                })}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email.message}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={errors.password ? 'error' : ''}
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { 
                    value: 6, 
                    message: "Password must be at least 6 characters" 
                  } 
                })}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password.message}</div>}
          </div>
          
          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? 'error' : ''}
                {...register("confirmPassword", { 
                  required: "Please confirm your password", 
                  validate: value => value === watch('password') || "Passwords do not match"
                })}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword.message}</div>}
          </div>
          
          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></label>
          </div>
          
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;