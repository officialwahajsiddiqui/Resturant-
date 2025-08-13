import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatImagePath } from '../../utils/imagePathUtils';

const EditMenu = () => {
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch menu item data
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });

        const data = await response.json();

        if (response.ok) {
          // Set form values
          setValue('title', data.title);
          setValue('shortDescription', data.shortDescription);
          setValue('price', data.price);
          setValue('type', data.type);
          
          // Set current image
          setCurrentImage(formatImagePath(data.imagePath));
        } else {
          toast.error(data.msg || 'Failed to fetch menu item');
          navigate('/admin/all-menus');
        }
      } catch (error) {
        console.error('Error fetching menu item:', error);
        toast.error('Server error. Please try again.');
        navigate('/admin/all-menus');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id, setValue, navigate]);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Submit form data
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('shortDescription', data.shortDescription);
      formData.append('price', data.price);
      formData.append('type', data.type);
      
      // Only append image if a new one is selected
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Menu item updated successfully!');
        // Add a small delay before navigation to ensure toast is displayed
        setTimeout(() => {
          navigate('/admin/all-menus');
        }, 1000);
      } else {
        toast.error(result.msg || 'Failed to update menu item');
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h3 className="mb-0">Edit Menu Item</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    {...register('title', { 
                      required: 'Title is required', 
                      minLength: { value: 3, message: 'Title must be at least 3 characters' } 
                    })}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="shortDescription" className="form-label">Short Description</label>
                  <textarea
                    className={`form-control ${errors.shortDescription ? 'is-invalid' : ''}`}
                    id="shortDescription"
                    rows="3"
                    {...register('shortDescription', { 
                      required: 'Short description is required', 
                      minLength: { value: 10, message: 'Description must be at least 10 characters' } 
                    })}
                  ></textarea>
                  {errors.shortDescription && <div className="invalid-feedback">{errors.shortDescription.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      step="0.01"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      id="price"
                      {...register('price', { 
                        required: 'Price is required', 
                        min: { value: 0, message: 'Price cannot be negative' },
                        valueAsNumber: true
                      })}
                    />
                  </div>
                  {errors.price && <div className="invalid-feedback d-block">{errors.price.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Menu Type</label>
                  <select
                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                    id="type"
                    {...register('type', { required: 'Menu type is required' })}
                  >
                    <option value="">Select a type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                  {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Menu Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    {...register('image')}
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">Leave empty to keep the current image</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image Preview</label>
                  <div className="text-center">
                    <img 
                      src={imagePreview || currentImage} 
                      alt="Preview" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '200px' }} 
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-warning" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : 'Update Menu Item'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={() => navigate('/admin/all-menus')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenu;