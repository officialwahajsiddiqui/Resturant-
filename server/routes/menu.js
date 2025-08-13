import express from "express";
import Menu from "../models/Menu.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const router = express.Router();

// Set up multer for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../client/public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images (jpeg, jpg, png, gif)!"));
  }
});

// @route   POST api/menu
// @desc    Create a new menu item
// @access  Private (Admin only)
router.post("/", [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const { title, shortDescription, price, type } = req.body;

    // Validate inputs
    if (!title || !shortDescription || !price || !type) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }

    // Create path to image for storage in DB
    const imagePath = `/uploads/${req.file.filename}`;
    // Log the image path for debugging
    console.log('Image path saved to DB:', imagePath);
    console.log('Full image URL would be:', `http://localhost:5000${imagePath}`);

    const newMenu = new Menu({
      title,
      shortDescription,
      price,
      type,
      imagePath,
      createdBy: req.user.id
    });

    await newMenu.save();
    res.status(201).json(newMenu);
  } catch (err) {
    console.error("Error creating menu item:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET api/menu
// @desc    Get all menu items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   GET api/menu/:id
// @desc    Get a menu item by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    res.json(menuItem);
  } catch (err) {
    console.error("Error fetching menu item:", err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Menu item not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   PUT api/menu/:id
// @desc    Update a menu item
// @access  Private (Admin only)
router.put("/:id", [auth, admin, upload.single('image')], async (req, res) => {
  try {
    const { title, shortDescription, price, type } = req.body;

    // Find menu item
    let menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (shortDescription) updateFields.shortDescription = shortDescription;
    if (price) updateFields.price = price;
    if (type) updateFields.type = type;

    // If new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (menuItem.imagePath) {
        const oldImagePath = path.join(uploadDir, path.basename(menuItem.imagePath));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set new image path
      updateFields.imagePath = `/uploads/${req.file.filename}`;
      // Log the image path for debugging
      console.log('Updated image path saved to DB:', updateFields.imagePath);
      console.log('Full updated image URL would be:', `http://localhost:5000${updateFields.imagePath}`);
    }

    // Update menu item
    menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(menuItem);
  } catch (err) {
    console.error("Error updating menu item:", err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Menu item not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private (Admin only)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    // Delete image file
    if (menuItem.imagePath) {
      const imagePath = path.join(uploadDir, path.basename(menuItem.imagePath));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete menu item from database
    await Menu.findByIdAndDelete(req.params.id);

    res.json({ msg: "Menu item deleted" });
  } catch (err) {
    console.error("Error deleting menu item:", err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Menu item not found" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;