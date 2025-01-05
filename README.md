# QuickPost

QuickPost is a simple, lightweight micro-blogging platform that allows users to create, manage, and explore posts in a streamlined way. Built with Django for the backend and React for the frontend, QuickPost focuses on delivering a modern, fast, and responsive user experience.

---

## 🚀 Features

- **User Authentication**:
  - Secure user login and registration system.
  - Session and token-based authentication (*JWT*) for seamless navigation.

- **Micro-Blogging Functionalities**:
  - Create, edit, and delete posts.
  - View your personalized feed.
  - Search and explore posts by other users.

- **Responsive Design**:
  - Fully responsive UI for desktop, tablet, and mobile devices.

- **Scalable Backend**:
  - Built using Django REST Framework to handle API calls efficiently.
  - Designed to scale with an increasing number of users and posts.

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Django and Django REST Framework  
- **Database**: MySQL (or PostgreSQL as an alternative)  
- **Version Control**: GitHub  

---

## 🖥️ Local Development Setup

Follow these steps to set up QuickPost on your local machine:

### Prerequisites
- Python 3.9+  
- Node.js 16+ and npm  
- Git  

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/manoj-323/QuickPost.git
cd QuickPost
```

---

### Step 2: Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/Mac
   venv\Scripts\activate     # For Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

---

### Step 3: Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

---

### Step 4: Access the Application

- Visit **[http://localhost:5173](http://localhost:5173)** in your browser to access the application.

---

## 📂 Project Structure

```
QuickPost/
├── backend/
│   ├── api/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── api/
│       ├── asgi.py
│       ├── settings.py
│       ├── urls.py
│       ├── wsgi.py
│       ├── __init__.py
│   ├── auth_api/
│   ├── comments/
│   ├── followers/
│   ├── media/
│   ├── posts/
│   ├── profiles/
│   ├── manage.py
│   ├── settings.py
│   └── ... (other Django files)
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── main.js
│   └── package.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add feature XYZ"
   ```
4. Push the changes to your fork:
   ```bash
   git push origin feature-branch
   ```
5. Create a pull request on the main repository.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## 🌟 Acknowledgments

- **Django** for the robust backend framework.  
- **React** for the intuitive frontend library.  
- **MySQL/PostgreSQL** for reliable database management.  

---

## 📧 Contact

For queries, suggestions, or feedback, feel free to contact me at:  
- **Name**: Manoj Kumar  
- **LinkedIn**: [Manoj Kumar](https://www.linkedin.com/in/manoj-kumar-r323)  
- **GitHub Profile**: [Manoj-323](https://github.com/manoj-323)  

---

## 🎯 Roadmap

Planned features for future releases:
1. Add user profile customization.  
2. Implement post liking and commenting.  
3. Improve search functionality with advanced filters.  
4. Enable multimedia (images/videos) in posts.  

---

Enjoy using **QuickPost**! Happy blogging! 😊

--- 
