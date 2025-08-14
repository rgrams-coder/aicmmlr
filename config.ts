export const API_CONFIG = {
  // For local development
  LOCAL_API_URL: 'http://localhost:3000',
  
  // For production (replace with your actual API Gateway URL after deployment)
  PROD_API_URL: 'https://your-api-gateway-url.execute-api.ap-south-1.amazonaws.com',
  
  // Current environment
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-api-gateway-url.execute-api.ap-south-1.amazonaws.com'
    : 'http://localhost:3000'
};
