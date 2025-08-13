import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

/**
 * @route   POST api/booking
 * @desc    Create a new booking
 * @access  Private
 */
router.post(
  '/',
  auth,
  [
    body('name', 'Name is required').not().isEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('datetime', 'Date and time is required').not().isEmpty().isISO8601().toDate(),
    body('people', 'Number of people is required').not().isEmpty().trim().escape(),
    body('message').trim().escape()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, datetime, people, message } = req.body;

    try {
      // Create new booking
      const newBooking = new Booking({
        name,
        email,
        datetime,
        people,
        message,
        user: req.user.id
      });

      // Save to database
      const booking = await newBooking.save();

      res.status(201).json({
        success: true,
        msg: 'Your booking has been confirmed!',
        booking
      });
    } catch (err) {
      console.error('Booking submission error:', err.message);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  }
);

/**
 * @route   GET api/booking
 * @desc    Get all bookings (admin only)
 * @access  Private/Admin
 */
router.get('/', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ datetime: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('Get bookings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   GET api/booking/user
 * @desc    Get user's bookings
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ datetime: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   DELETE api/booking/:id
 * @desc    Delete a booking
 * @access  Private/Admin
 */
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    await booking.deleteOne();

    res.json({ msg: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete booking error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   GET api/booking/search
 * @desc    Search bookings by name or email (admin only)
 * @access  Private/Admin
 */
router.get('/search', auth, admin, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const bookings = await Booking.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).sort({ datetime: 1 });

    res.json(bookings);
  } catch (err) {
    console.error('Search bookings error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;