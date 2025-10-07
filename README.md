# Fullstack Cart App

A fullstack e-commerce application built using Express.js, MongoDB and Angular. The application allows users to view products, add them to cart, and checkout. The application also provides an admin dashboard to manage products and orders.

## Features

- CRUD Operations on Products from backend dashboard
- Ability to change order status and notify user on Frontend
- Secure User registration and Database storage
- Real-time updates on order status using Web Push API

## Technologies Used

- Backend: Express.js, MongoDB
- Frontend: Angular
- Real-time updates: Web Push API

## Project Structure

The project structure is as follows:

```bash
- client/
  - app/
    - app.component.ts
    - app.component.html
    - app.module.ts
    - app.routes.ts
    - components/
      - product-card/
        - product-card.component.ts
        - product-card.component.html
      - cart/
        - cart.component.ts
        - cart.component.html
      - orders/
        - orders.component.ts
        - orders.component.html
      - navbar/
        - navbar.component.ts
        - navbar.component.html
    - pages/
      - home/
        - home.component.ts
        - home.component.html
      - orders/
        - orders.component.ts
        - orders.component.html
      - login/
        - login.component.ts
        - login.component.html
  - assets/
    - img/
    - styles.css
  - environments/
    - environment.prod.ts
    - environment.ts
  - tsconfig.app.json
  - tsconfig.spec.json
- server/
  - app.ts
  - controllers/
    - authController.ts
    - orderController.ts
    - productApiController.ts
  - models/
    - orderModel.js
    - productModel.js
  - route/
    - api.js
    - web.js
  - services/
    - auth.service.ts
    - order.service.ts
    - product.service.ts
    - push.service.ts
  - utils/
    - mongooseConnection.ts
    - multerConfig.ts
  - package.json
```

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository using `git clone https://github.com/seifsheikhelarab/Fullstack-Cart-App.git`
2. Install the dependencies using `npm install` or `yarn install`
3. Start the server using `npm run start` or `yarn start`
4. Open your web browser and navigate to `http://localhost:4200` to view the application.
