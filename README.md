# Dev-Tinder Backend

REST API for a developer matching app (Tinder-style connections). Express + MongoDB with JWT cookie auth, bcrypt passwords, and request validation.

## Features

- Sign up / login with hashed passwords (`bcrypt`)
- JWT issued on login; stored in HTTP cookie
- Protected routes via auth middleware (`/profile`, connection requests)
- Signup/login validation helpers
- Mongoose `User` model + MongoDB connection module

## Tech stack

- Node.js / Express 5
- MongoDB / Mongoose
- JSON Web Tokens + `cookie-parser`
- `dotenv`, `validator`

## API overview

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/signup` | No | Create user (`firstName`, `lastName`, `emailId`, `password`) |
| `POST` | `/login` | No | Authenticate; sets `token` cookie |
| `GET` | `/profile` | Cookie JWT | Return current user |
| `POST` | `/sendConnectionRequest` | Cookie JWT | Send a connection request |

Default port: `6262`.

## Setup

```bash
git clone https://github.com/anuragarya8/Dev-Tinder-BE.git
cd Dev-Tinder-BE
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev    # nodemon
# or
npm start
```

## Project structure

```
Dev-Tinder-BE/
├── app.js
├── package.json
└── src/
    ├── config/database.js
    ├── middlewares/auth.js
    ├── models/user.js
    └── utils/validation.js
```

## Author

[Anurag Arya](https://github.com/anuragarya8) · [Portfolio](https://portfolio-orpin-sigma-37.vercel.app)
