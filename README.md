# CST3144 Express.js After-School API

## Required Links
- **Vue.js App GitHub Repository:** https://github.com/FZKLR/CST3144-Vue-App
- **Vue.js App GitHub Pages:** https://fzklr.github.io/CST3144-Vue-App/
- **Express.js App GitHub Repository:** https://github.com/FZKLR/CST3144-Express-API
- **Express.js Render `/lessons` Endpoint:** https://m01033601-cst3144-after-school.onrender.com/lessons

## REST API Routes
- `GET /lessons` — Returns all lessons from MongoDB Atlas as JSON.
- `POST /orders` — Validates and saves a new order into the `order` collection.
- `PUT /lessons/:id` — Validates and updates attributes on a lesson in the `lesson` collection.
- `GET /images/:filename` — Serves lesson images or returns a 404 message if missing.