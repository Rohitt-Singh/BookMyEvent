# BookMyEvent - Full-Stack Event Booking Platform

BookMyEvent is a full-stack MERN application that allows users to browse events, register, search for events, and submit ticket booking requests. It features an administrative dashboard for event organizers to create and manage free and paid events. Bookings can be reviewed and managed manually by an admin, including payment status management.

## Features

- **User Authentication**: Secure login & registration with JWT and bcrypt.

- **Email OTP Verification**:
  - Mandatory Email OTP to verify accounts during registration.
  - Mandatory Email OTP to authorize event ticket booking.

- **Role-Based Access**:
  - **Admin**: Create, edit, and delete events. View and manage all incoming booking requests, confirm or cancel bookings, and mark them as 'Paid' or 'Not Paid'. Admin access is restricted to users with the admin role.
  - **User**: Browse events, search events, submit ticket booking requests via OTP, view personal booking status, and cancel bookings.

- **Event Management**: Create and manage free and paid events with detailed descriptions, external image URLs, dates, categories, ticket prices, and seating capacity.

- **Smart Booking System**:
  - Mandatory Email OTP to authorize a booking request.
  - All booking requests enter a `Pending` state for Admin verification.
  - Prevents duplicate bookings for the same event.
  - Validates seat availability before confirming bookings.
  - Automatically updates available seats when bookings are confirmed or cancelled.

- **Admin Dashboard**: View and manage events, booking requests, payment status, available seats, and revenue-related statistics.

- **Email Notifications**: Automated email delivery for OTP verification and successful booking confirmation using Nodemailer.

- **Event Search**: Search events by title using case-insensitive search.

- **Sleek UI/UX**: Built with React and Tailwind CSS with responsive layouts and interactive components.

---

🚀 ## Setup Instructions

**Prerequisites**
Make sure you have Node.js installed on your machine. You will also need a MongoDB database (e.g., MongoDB Atlas Free Tier).

1. Environment Variables Configuration
Navigate to server/.env and fill in the necessary keys:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_bookmyevent
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5000
Note: For EMAIL_PASS, you need to generate an "App Password" from your Google Account settings, standard passwords won't work due to 2FA.

2. Run from Outer Folder (Single Terminal)
You can now manage both backend and frontend from the project root:

from BookMyEvent root

npm install
npm run install:all
npm run dev
npm run dev starts both server and client together using concurrently.
npm run dev:all installs dependencies (server + client) and starts both in one command.
npm run start runs backend start + frontend preview together.

3. Install Dependencies
Open two separate terminals for the backend and frontend.

Backend Terminal:

cd server
npm install --legacy-peer-deps
Frontend Terminal:

cd client
npm install

4. Run the Application Local Servers
Run Backend:

cd server
npm run dev
(Server will run on http://localhost:5000)

Run Frontend:

cd client
npm run dev
(Client will run on a local port provided by Vite, typically http://localhost:5173)
