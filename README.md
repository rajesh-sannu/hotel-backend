🍽️ Hotel Order Management System – Backend

A complete Node.js + Express + MongoDB backend for hotel/restaurant order management.
Includes menu CRUD, waiter orders, billing, stock control, Cloudinary images, admin login, OTP reset, and full analytics.

🚀 Features
🔐 Authentication

Admin & waiter login (JWT)

Admin-only waiter creation

OTP-based password reset via Gmail

🍽️ Menu Management

Add, update, delete menu items

Cloudinary image upload & delete

Stock status: In Stock / Out of Stock

🧾 Order Management

Waiters create table orders

Admin can edit, delete, apply discount

Lock/finalize orders for billing

Billing history support

📊 Analytics

Today's sales summary

Daily sales graph

Best-selling items

Highest revenue day

☁️ Cloud Storage

Multer + Cloudinary integration

Auto optimized images

🛠️ Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Nodemailer (Gmail App Password)

Cloudinary

Multer

bcryptjs

📁 Project Structure
backend/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── server.js
 └── .env

⚙️ Installation
1️⃣ Clone the Project
git clone https://github.com/YOUR_USERNAME/hotel-backend.git
cd hotel-backend

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File

Paste this:

PORT=5000

MONGO_URI=your_mongodb_url

JWT_SECRET=your_secret_key

SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx


⚠️ Must use Gmail App Password, not your regular Gmail password.

4️⃣ Start Server
npm run dev

📌 API Endpoints
🔐 AUTH ROUTES
Method	Endpoint	Description
POST	/admin/register	Register admin
POST	/admin/login	Login admin/waiter
POST	/admin/create-waiter	Create waiter
POST	/admin/send-otp	Send OTP
POST	/admin/verify-otp	Verify OTP
POST	/admin/reset-password	Reset password
🍽️ MENU ROUTES
Method	Endpoint	Description
POST	/menu/add	Add item + image
GET	/menu/all	Get all items
PUT	/menu/update/:id	Update item
DELETE	/menu/delete/:id	Delete item
🧾 ORDER ROUTES
Method	Endpoint	Description
POST	/orders/create	Create order
GET	/orders/get/:tableId	Get active order
PUT	/orders/update/:id	Edit order
PUT	/orders/finalize/:id	Finalize + lock order
DELETE	/orders/delete-item/:id	Delete order item
📊 ANALYTICS ROUTES
Method	Endpoint	Description
GET	/analytics/summary/today	Today's summary
GET	/analytics/daily	Daily chart data
GET	/analytics/best-sellers	Top-selling dishes
GET	/analytics/highest-sales-day	Best revenue day
🖼️ Cloudinary Image Flow

Upload from React → Multer

Multer sends to Cloudinary

Cloudinary returns URL

URL stored in MongoDB

Old image deleted automatically on update

🛡️ Security

Password hashing with bcrypt

JWT Secured routes

OTP 5-minute expiry

CORS enabled

🚀 Deployment
Recommended Platforms:

Render (best for free backend)

Railway

Vercel (Serverless)

Deploy Steps:

Push project to GitHub

Create a Web Service on Render

Add .env values

Deploy & get live backend URL

📄 License

MIT License – free for personal and commercial uses.
