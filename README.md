# 🍽️ Restoran - Restaurant Website

## ✨ Live Demo

Visit the live version of this project: [Restoran Live Demo](https://resturant-frontend-psi.vercel.app/)

## 📋 Overview

Restoran is a full-stack restaurant website built with React and Node.js. It features a beautiful UI with menu management, booking system, and contact functionality. The application allows restaurant owners to manage their menu items, handle reservations, and interact with customers.

## 🚀 Features

- **Beautiful UI** with Bootstrap and custom styling
- **Menu Management** with image uploads
- **Booking System** for table reservations
- **Contact Form** for customer inquiries
- **User Authentication** with JWT
- **Admin Dashboard** for restaurant management
- **Responsive Design** for all devices

## 🛠️ Technologies Used

### Frontend
- React 19
- React Router
- Bootstrap 5
- React Hook Form
- React Toastify
- Framer Motion
- React Slick (carousel)

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Multer (file uploads)
- Bcrypt.js (password hashing)

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Clone the Repository

```bash
git clone https://github.com/officialwahajsiddiqui/Resturant-Project.git
cd Resturant
```

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory with:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The client will run on http://localhost:5173 or http://localhost:5174

## 📱 Usage

### Customer Features
- Browse the restaurant menu
- Make table reservations
- Contact the restaurant
- Create an account/login

### Admin Features
- Manage menu items (add, edit, delete)
- View and manage bookings
- Respond to contact messages
- User management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.


## 📞 Contact

For any questions or feedback, please reach out to the project maintainer.

---

⭐ Star this repo if you find it useful! ⭐
