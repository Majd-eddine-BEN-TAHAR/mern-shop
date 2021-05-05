# e-commerce using MERN stack

For live preview visit : [mern-shop](https://majd-shop.netlify.app/).

## Env Variables

Create a .env file in the root directory and add the following variables with your own values

```
NODE_ENV = development
PORT = 8080
DATABASE_NAME = e-commerce
JWT_SECRET = abc123
EMAIL = test@example.com
EMAIL_PASSWORD = password
PUBLIC_KEY = your own public_key from imagekit.io to host your  images
PRIVATE_KEY = your own private_key from imagekit.io to host your  images
URL_ENDPOINT = your own url_endpoint from imagekit.io to host your  images
```

## Features

- Authentication
- Reset password with link
- Product creation
- Product updating
- Product deletion
- User role update
- Order placing
- Product reviews and ratings
- Top products
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping)
- Host images in imageKit

## Install Dependencies

```
npm install
cd client
npm install
```

## Run the app

### for the server (:8080)

```
npm run dev
```

### for the client (:3000)

```
cd client
npm start
```

## Build & Deploy

```
# Create client production build
npm run build
```

if you gonna use heroku you don't need to build manually for deployment because there is a Heroku postbuild script.
