# Update API URL for Production

After deploying your backend to Render, you need to update the API URL in your frontend files.

## Your Backend URL
After deploying to Render, you'll get a URL like:
`https://brainboost-backend.onrender.com`

## Files to Update

Replace `http://localhost:5000` with your Render backend URL in these files:

1. **frontend/src/components/Login.tsx**
   - Line: `const res = await axios.post('http://localhost:5000/api/auth/login'`
   - Change to: `const res = await axios.post('YOUR_BACKEND_URL/api/auth/login'`

2. **frontend/src/components/Register.tsx**
   - Line: `const res = await axios.post('http://localhost:5000/api/auth/register'`
   - Change to: `const res = await axios.post('YOUR_BACKEND_URL/api/auth/register'`

3. **frontend/src/components/KidMemoryGame.tsx**
   - Line: `const res = await axios.get('http://localhost:5000/api/games/progress'`
   - Line: `await axios.post('http://localhost:5000/api/games/progress'`
   - Change both to: `YOUR_BACKEND_URL/api/games/progress`

4. **frontend/src/components/ColorMatchGame.tsx**
   - Same as above

5. **frontend/src/components/CountingStarsGame.tsx**
   - Same as above

6. **frontend/src/components/CreativityGame.tsx**
   - Same as above

## Better Approach: Use Environment Variable

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

Then in all files, replace:
```javascript
'http://localhost:5000'
```
with:
```javascript
process.env.REACT_APP_API_URL || 'http://localhost:5000'
```

This way, it uses the production URL when deployed and localhost during development.
