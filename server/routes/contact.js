import express from 'express';
import Contact from '../models/Contact.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

/**
 * @route   POST api/contact
 * @desc    Submit a contact form
 * @access  Public
 */
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Please enter a valid email address' });
  }

  try {
    // Create new contact submission
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    // Save to database
    const contact = await newContact.save();

    res.status(201).json({
      success: true,
      msg: 'Your message has been sent successfully!',
      contact
    });
  } catch (err) {
    console.error('Contact submission error:', err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

/**
 * @route   GET api/contact
 * @desc    Get all contact submissions (admin only)
 * @access  Private/Admin
 */
router.get('/', auth, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   DELETE api/contact/:id
 * @desc    Delete a contact submission (admin only)
 * @access  Private/Admin
 */
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    await contact.deleteOne();

    res.json({ msg: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Delete contact error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route   GET api/contact/search
 * @desc    Search contact submissions by name or email (admin only)
 * @access  Private/Admin
 */
router.get('/search', auth, admin, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const contacts = await Contact.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (err) {
    console.error('Search contacts error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;