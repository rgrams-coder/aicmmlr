# Deployment Guide

## Backend Deployment

1. **Configure Environment Variables**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Update `.env` with your actual values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret

2. **Deploy to AWS**
   ```bash
   npm install
   npm run deploy
   ```

3. **Note the API Gateway URL** from the deployment output

## Frontend Configuration

1. **Update API Configuration**
   Edit `config.ts` and replace `your-api-gateway-url` with the actual URL from backend deployment:
   ```typescript
   PROD_API_URL: 'https://your-actual-api-gateway-url.execute-api.ap-south-1.amazonaws.com'
   ```

2. **Build and Deploy Frontend**
   ```bash
   npm install
   npm run build
   ```

## Local Development

1. **Start Backend Locally**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```

## Features Integrated

✅ **Authentication**
- User registration with payment
- User and admin login
- JWT token management
- Profile management

✅ **Payment Integration**
- Razorpay integration for registration fees
- Subscription payments for library access
- Payment verification

✅ **Document Management**
- Admin can create/update/delete documents
- Users can view documents with subscription
- Document categorization

✅ **Case Management**
- Users can submit consultancy cases
- Admin can manage and respond to cases
- Payment for case solutions

✅ **Feedback & Contact**
- User feedback system
- Contact form submissions
- Admin can view all messages

✅ **Data Persistence**
- All data stored in MongoDB
- No more dummy data
- Real-time updates

## API Endpoints

All endpoints are now connected to the backend:
- Authentication: `/register`, `/login`, `/admin/login`
- Profile: `/profile` (GET, PUT)
- Payments: `/createOrder`, `/payment/verify`
- Cases: `/cases` (GET, POST, PUT)
- Documents: `/documents` (GET, POST, PUT, DELETE)
- Feedback: `/feedback`, `/admin/feedbacks`
- Contact: `/contact`, `/admin/contact-messages`
- Admin: `/admin/users`