import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    minlength: [10, 'Short description must be at least 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Menu type is required'],
    enum: ['breakfast', 'lunch', 'dinner'],
    default: 'breakfast'
  },
  imagePath: {
    type: String,
    required: [true, 'Image path is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;