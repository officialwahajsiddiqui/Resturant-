import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { formatImagePath, handleImageError } from '../../utils/imagePathUtils';

const AllMenus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        console.log('Fetched menu items:', data); // Debug log
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch menu items');
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Handle delete confirmation
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Handle delete menu item
  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/menu/${itemToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMenuItems(menuItems.filter(item => item._id !== itemToDelete._id));
        toast.success('Menu item deleted successfully');
      } else {
        toast.error(data.msg || 'Failed to delete menu item');
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast.error('Server error. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">All Menu Items</h2>
        <Link to="/admin/add-menu" className="btn btn-primary">
          Add New Menu Item
        </Link>
      </div>

      {/* Search Bar */}
      <div className="input-group mb-4">
        <span className="input-group-text bg-primary text-white">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredMenuItems.length === 0 ? (
        <div className="alert alert-info">
          {searchTerm ? 'No menu items match your search.' : 'No menu items found. Add some!'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img 
                      src={formatImagePath(item.imagePath)} 
                      alt={item.title} 
                      className="img-thumbnail" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                      onError={(e) => handleImageError(e, item.imagePath)}
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.shortDescription.length > 50 ? `${item.shortDescription.substring(0, 50)}...` : item.shortDescription}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${item.type === 'breakfast' ? 'bg-success' : item.type === 'lunch' ? 'bg-primary' : 'bg-danger'}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Link to={`/admin/edit-menu/${item._id}`} className="btn btn-sm btn-warning me-1">
                        <FaEdit /> Edit
                      </Link>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => confirmDelete(item)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{itemToDelete?.title}</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMenus;