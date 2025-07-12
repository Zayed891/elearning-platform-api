# 🎓 SkillForge API

A complete backend API for an online learning platform built with Node.js, Express, and MongoDB. Features comprehensive authentication, course management, and purchase system.

## 🚀 Features

### 👨‍💼 Admin Features
- **Authentication**: Secure signup/signin with JWT tokens
- **Course Management**: Create, update, and view courses
- **Authorization**: Role-based access control

### 👨‍🎓 User Features  
- **Authentication**: User registration and login
- **Course Purchase**: Buy courses with duplicate prevention
- **Course Access**: View purchased courses with full details
- **Course Preview**: Browse available courses

### 🔧 Technical Features
- **JWT Authentication**: Secure token-based auth for both admin and users
- **Input Validation**: Comprehensive validation using Zod schemas
- **Password Security**: Bcrypt hashing for secure password storage
- **Database Relations**: MongoDB with Mongoose ODM and population
- **Error Handling**: Proper HTTP status codes and error responses
- **Environment Config**: Secure environment variable management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Environment**: dotenv

## 📁 Project Structure

```
coursera_backend/
├── auth/
│   ├── admin.js          # Admin authentication middleware
│   └── user.js           # User authentication middleware
├── routes/
│   ├── admin.js          # Admin routes (signup, signin, course management)
│   ├── user.js           # User routes (signup, signin, purchases)
│   └── course.js         # Course routes (purchase, preview)
├── config.js             # Environment configuration
├── db.js                 # Database schemas and models
├── index.js              # Main server file
├── .env                  # Environment variables (not in repo)
├── .env.example          # Environment variables example
└── package.json          # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Zayed891/elearning-platform-api.git
   cd elearning-platform-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_ADMIN_SECRET=your_admin_secret
   JWT_USER_SECRET=your_user_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/signup` | Admin registration | No |
| POST | `/admin/signin` | Admin login | No |
| POST | `/admin/course` | Create new course | Yes |
| PUT | `/admin/course/:courseId` | Update course | Yes |
| GET | `/admin/course/bulk` | Get admin's courses | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/signup` | User registration | No |
| POST | `/user/signin` | User login | No |
| GET | `/user/purchases` | Get purchased courses | Yes |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/course/purchase/:courseId` | Purchase a course | Yes (User) |
| GET | `/course/preview` | Preview available courses | No |

### Authentication

For protected routes, include the token in headers:
```javascript
headers: {
  'token': 'your_jwt_token_here'
}
```

## 📝 API Examples

### Admin Signup
```javascript
POST /api/v1/admin/signup
{
  "email": "admin@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe"
}
```

### Create Course
```javascript
POST /api/v1/admin/course
Headers: { "token": "admin_jwt_token" }
{
  "title": "React Masterclass",
  "description": "Learn React from scratch",
  "price": 99,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Purchase Course
```javascript
POST /api/v1/course/purchase/64f7b1234567890abcdef123
Headers: { "token": "user_jwt_token" }
```

## 🗄️ Database Schema

### User Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstname: String,
  lastname: String
}
```

### Course Schema
```javascript
{
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId (ref: Admin)
}
```

### Purchase Schema
```javascript
{
  courseId: ObjectId (ref: Course),
  userId: ObjectId (ref: User)
}
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with separate secrets for admin/user
- **Input Validation**: All endpoints validate input using Zod schemas
- **Authorization**: Role-based access control (admin vs user)
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

Test the API using tools like:
- **Postman** (recommended)
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Frontend applications**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Zayed Aktar**
- GitHub: [@Zayed891](https://github.com/Zayed891)
- Email: jayedaktar35@gmail.com

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- MongoDB team for the robust database
- JWT community for secure authentication solutions

---

⭐ **Star this repository if it helped you!**
