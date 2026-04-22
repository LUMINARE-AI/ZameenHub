# Render Deployment Checklist

## Backend service

- Set the root directory to `Backend`
- Build command: `npm install`
- Start command: `node src/index.js`
- Add these environment variables in Render:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLOUD_NAME`
  - `API_KEY`
  - `API_SECRET`

## Frontend service

- Set the root directory to `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add this environment variable in Render:
  - `VITE_API_BASE_URL=https://<your-backend-service>.onrender.com/api`

## Cloudinary

- Make sure `CLOUD_NAME`, `API_KEY`, and `API_SECRET` all come from the same Cloudinary product environment/account
- The current local test failed with `cloud_name mismatch`, so re-copy these values carefully
- After updating Cloudinary env vars, redeploy the backend

## MongoDB Atlas

- Confirm the Render backend IP access rule allows connections, or use `0.0.0.0/0` if appropriate for your setup
- Verify the database user in `MONGO_URI` still exists and has read/write access

## Post-deploy smoke test

1. Open the deployed frontend
2. Login with a phone number
3. Create a property without image
4. Create a property with image
5. Open dashboard and confirm the property appears
6. Login as admin and approve the property
7. Confirm the approved property shows on the public listings page
