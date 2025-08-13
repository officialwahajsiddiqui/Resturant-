import React, { useState, useEffect } from 'react'
import HeroSection from './miniComponents/HeroSection'
import useResponsive from '../hooks/useResponsive'
import { FaSearch } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatImagePath, handleImageError } from '../utils/imagePathUtils'

const Menu = () => {
    const [activeTab, setActiveTab] = useState('tab-1')
    const [menuItems, setMenuItems] = useState([])
    const [filteredItems, setFilteredItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { isMobile } = useResponsive()

    // Fetch menu items from API
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/menu')
                const data = await response.json()
                console.log('Fetched menu items in Menu.jsx:', data); // Debug log

                if (response.ok) {
                    setMenuItems(data)
                    // Initially filter by breakfast (tab-1)
                    setFilteredItems(data.filter(item => item.type === 'breakfast'))
                } else {
                    setError('Failed to fetch menu items')
                }
            } catch (err) {
                console.error('Error fetching menu items:', err)
                setError('Server error. Please try again.')
                toast.error('Failed to fetch menu items');
            } finally {
                setLoading(false)
            }
        }

        fetchMenuItems()
    }, [])

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
        setSearchTerm('')

        // Filter menu items based on tab
        if (tabId === 'tab-1') {
            setFilteredItems(menuItems.filter(item => item.type === 'breakfast'))
        } else if (tabId === 'tab-2') {
            setFilteredItems(menuItems.filter(item => item.type === 'lunch'))
        } else if (tabId === 'tab-3') {
            setFilteredItems(menuItems.filter(item => item.type === 'dinner'))
        }
    }

    // Handle search
    const handleSearch = (e) => {
        const term = e.target.value
        setSearchTerm(term)

        // Get current filter type based on active tab
        let filterType = 'breakfast'
        if (activeTab === 'tab-2') filterType = 'lunch'
        if (activeTab === 'tab-3') filterType = 'dinner'

        // Filter by both type and search term
        if (term.trim() === '') {
            setFilteredItems(menuItems.filter(item => item.type === filterType))
        } else {
            setFilteredItems(
                menuItems.filter(item =>
                    item.type === filterType &&
                    item.title.toLowerCase().includes(term.toLowerCase())
                )
            )
        }
    }

    // Render menu items function to avoid duplication
    const renderMenuItems = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
        }

        if (error) {
            return <div className="alert alert-danger">{error}</div>
        }

        if (filteredItems.length === 0) {
            return (
                <div className="alert alert-info">
                    {searchTerm ? 'No menu items match your search.' : 'No menu items found in this category.'}
                </div>
            )
        }

        return (
            <div className="row g-4">
                {filteredItems.map((item) => (
                    <div key={item._id} className={`${isMobile ? 'col-12' : 'col-lg-6'}`}>
                        <div className="d-flex align-items-center menu-item">
                            <img
                                className="flex-shrink-0 img-fluid rounded"
                                src={formatImagePath(item.imagePath)}
                                alt={item.title}
                                style={{ width: 80, height: 80, objectFit: 'cover' }}
                                onError={(e) => handleImageError(e, item.imagePath)}
                            />
                            <div className="w-100 d-flex flex-column text-start ps-4">
                                <h5 className="d-flex justify-content-between border-bottom pb-2">
                                    <span>{item.title}</span>
                                    <span className="text-primary">${item.price.toFixed(2)}</span>
                                </h5>
                                <small className="fst-italic">
                                    {item.shortDescription}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} />
            <HeroSection heading={'Food Menu'} breadcrumbLast={'Menu'} />
            {/* Menu Start */}
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                        <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                            Food Menu
                        </h5>
                        <h1 className="mb-5">Most Popular Items</h1>

                        {/* Search Bar */}
                        <div className="col-md-6 mx-auto mb-4">
                            <div className="input-group">
                                <span className="input-group-text bg-primary text-white">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search menu items..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
                        <div className={`nav-container ${isMobile ? 'scrollable-tabs' : ''}`}>
                            <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                                <li className="nav-item">
                                    <a
                                        className={`d-flex align-items-center text-start mx-3 ms-0 pb-3 ${activeTab === 'tab-1' ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleTabClick('tab-1')
                                        }}
                                        href="#tab-1"
                                    >
                                        <i className="fa fa-coffee fa-2x text-primary" />
                                        <div className="ps-3">
                                            <small className="text-body">Popular</small>
                                            <h6 className="mt-n1 mb-0">Breakfast</h6>
                                        </div>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`d-flex align-items-center text-start mx-3 pb-3 ${activeTab === 'tab-2' ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleTabClick('tab-2')
                                        }}
                                        href="#tab-2"
                                    >
                                        <i className="fa fa-hamburger fa-2x text-primary" />
                                        <div className="ps-3">
                                            <small className="text-body">Special</small>
                                            <h6 className="mt-n1 mb-0">Lunch</h6>
                                        </div>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`d-flex align-items-center text-start mx-3 me-0 pb-3 ${activeTab === 'tab-3' ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleTabClick('tab-3')
                                        }}
                                        href="#tab-3"
                                    >
                                        <i className="fa fa-utensils fa-2x text-primary" />
                                        <div className="ps-3">
                                            <small className="text-body">Lovely</small>
                                            <h6 className="mt-n1 mb-0">Dinner</h6>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Fixed Tab Content Structure */}
                        <div className="tab-content">
                            <div id="tab-1" className={`tab-pane fade ${activeTab === 'tab-1' ? 'show active' : ''} p-0`}>
                                {renderMenuItems()}
                            </div>
                            <div id="tab-2" className={`tab-pane fade ${activeTab === 'tab-2' ? 'show active' : ''} p-0`}>
                                {renderMenuItems()}
                            </div>
                            <div id="tab-3" className={`tab-pane fade ${activeTab === 'tab-3' ? 'show active' : ''} p-0`}>
                                {renderMenuItems()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Menu End */}
        </>
    )
}

export default Menu