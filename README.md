# CRUD Operations with Node.js & MongoDB

[![Node.js](https://img.shields.io/badge/Node.js-v20-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-brightgreen)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-blue)](https://mongodb.com/)

## 📋 Overview
Features a responsive frontend dashboard.

### ✨ Features
- **Full CRUD Operations**: Create, Read (paginated/searchable), Update, Delete (soft delete)
- **Search & Pagination** across name, email, phone
- **Input Validation** (name, phone, image URL)
- **Image URL Support** for product images
- **Soft Delete** (isDeleted flag)
- **Responsive Frontend** with vanilla JavaScript


### 🛠️ Tech Stack
| Frontend | Backend | Database | Dev Tools |
|----------|---------|----------|-----------|
| HTML5, CSS3, JavaSScript | Node.js, Express | MongoDB, Mongoose | Nodemon, dotenv |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Setup
1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd CRUD_with_Node
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create `.env` file in root:
   ```
   MONGO_URI=mongodb://localhost:27017/crud_products
   PORT=3000
   ```
   *Use MongoDB Atlas URI for cloud: `mongodb+srv://...`*

4. **Run the application**
   ```bash
   # Development (with nodemon)
   npm run dev
   
   # Production
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔗 Usage
Access the web app at `http://localhost:3000`. The frontend provides a complete dashboard for managing products with forms for add/edit, search, pagination, and bulk actions. No external API connections required – all handled internally.


## 📁 Project Structure
```
CRUD_with_Node/
├── controllers/     # Business logic
│   └── ProductController.js
├── models/          # Mongoose schemas
│   └── Product.js
├── routes/          # Express routes
│   └── productRoutes.js
├── public/          # Static assets
│   ├── script.js
│   └── styles.css
├── views/           # HTML templates
│   └── index.html
├── server.js        # Main server file
├── package.json     # Dependencies & scripts
├── .env             # Environment variables
├── README.md        # You're reading it!
└── TODO.md          # Progress tracking
```

## 🔧 Development

### Scripts
```bash
npm run dev    # Start with nodemon (recommended)
npm start      # Production mode
```

### Product Schema
```javascript
{
  name: String (required),
  email: String,
  phone: String (required, min 10 chars),
  image: String (URL),
  status: Boolean (default: true),
  isDeleted: Boolean (default: false),
  created_date: Date,
  updated_date: Date
}
```

## 🚀 Deployment
1. Set `MONGO_URI` to MongoDB Atlas
2. `npm install --production`
3. Use PM2 or Docker
4. Deploy to Vercel, Render, Railway, etc.

**Example Docker (add Dockerfile):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing
1. Fork the repo for contribute
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push & PR

## 📄 License
This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments
- Built following Node.js/Express/MongoDB best practices

---

**⭐ Star this repo if you found it helpful!**

