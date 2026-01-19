# Troubleshooting Guide

This guide covers common issues and their solutions for the Article Scraper application.

## Backend Issues

### Port 8000 Already in Use

**Error:** `Error: [Errno 98] Address already in use` or similar

**Solution:**
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Module Not Found Error

**Error:** `ModuleNotFoundError: No module named 'fastapi'` or similar

**Solution:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Database Locked Error

**Error:** `sqlite3.OperationalError: database is locked`

**Solution:**
```bash
cd backend
rm -f articles.db articles.db-journal
# Restart the backend server - it will recreate the database
```

### API Key Errors

**Error:** `401 Unauthorized` or `Invalid API key`

**Solution:**
1. Check that your API keys are correctly set in `backend/.env`
2. Verify your Guardian API key is valid: https://open-platform.theguardian.com/access/
3. Verify your Groq API key is valid: https://console.groq.com/
4. Make sure there are no extra spaces or quotes in the `.env` file

### Groq API Error: Unexpected Keyword 'proxies'

**Error:** `TypeError: Client.__init__() got an unexpected keyword argument 'proxies'`

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install groq==0.5.0 httpx==0.24.0 --force-reinstall
```

### Guardian API Rate Limiting

**Error:** `429 Too Many Requests`

**Solution:**
- The Guardian API has rate limits
- Wait a few minutes before scraping again
- Consider reducing `page_size` when calling `/api/scrape`

## Frontend Issues

### Port 3000 Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found Error

**Error:** `Module not found: Can't resolve 'framer-motion'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### API Connection Refused

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Make sure the backend server is running on port 8000
2. Check that `frontend/.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Verify CORS is enabled in backend (check `backend/.env`)

### Next.js Build Errors

**Error:** Type errors during build

**Solution:**
```bash
cd frontend
npm run build
# If there are type errors, check the TypeScript output
# Most errors are in the terminal output
```

### Styles Not Loading

**Issue:** Tailwind CSS classes not working

**Solution:**
```bash
cd frontend
rm -rf .next
npm run dev
```

## General Issues

### Application Not Starting

**Symptoms:** Neither backend nor frontend loads

**Solution:**
1. Check Python is installed: `python3 --version` (needs 3.9+)
2. Check Node.js is installed: `node --version` (needs 18+)
3. Check npm is installed: `npm --version`
4. Verify you're in the correct directories when running commands

### Can't Connect to Backend from Frontend

**Symptoms:** Frontend loads but API calls fail

**Solution:**
1. Backend must be running first
2. Check CORS settings in `backend/.env`:
   ```
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
3. Verify `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Check browser console for specific error messages

### Scraping Not Working

**Symptoms:** Clicking "Start Scraping" does nothing

**Solution:**
1. Check Guardian API key is valid in `backend/.env`
2. Look at backend terminal for error messages
3. Check your internet connection
4. Verify the Guardian API is accessible: https://content.guardianapis.com

### AI Summaries Not Generating

**Symptoms:** Clicking "Generate Summary" shows error

**Solution:**
1. Check Groq API key is valid in `backend/.env`
2. Verify article has content to summarize
3. Check backend terminal for Groq API errors
4. Ensure you have available Groq API credits

### Bookmarks Not Persisting

**Symptoms:** Bookmarking works but disappears on refresh

**Solution:**
1. Check database file exists: `backend/articles.db`
2. Verify backend can write to disk
3. Check browser console for API errors
4. Look at backend terminal for database errors

## Getting Help

If you're still having issues:

1. **Check the logs:**
   - Backend terminal output
   - Browser console (F12 → Console tab)
   - Network tab for failed API requests

2. **Verify configuration:**
   - `backend/.env` has valid API keys
   - `frontend/.env.local` has correct API URL
   - No typos in environment variables

3. **Restart everything:**
   ```bash
   # Kill all processes
   pkill -f uvicorn
   pkill -f "next dev"
   
   # Restart backend
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Restart frontend (new terminal)
   cd frontend
   npm run dev
   ```

4. **Check documentation:**
   - Main README.md
   - SETUP.md
   - Backend README.md
   - Frontend README.md

5. **API Documentation:**
   - Visit http://localhost:8000/docs for interactive API docs
   - Test endpoints directly from the Swagger UI

## Common Development Issues

### VS Code Issues

**Issue:** IntelliSense not working for TypeScript/Python

**Solution:**
- Install VS Code extensions: Prettier, ESLint, Python
- Restart VS Code
- Check for errors in the problems panel

### Virtual Environment Issues

**Issue:** Can't activate venv or packages not found

**Solution:**
```bash
# Delete and recreate venv
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Git Issues

**Issue:** Git tracking unwanted files

**Solution:**
```bash
# Make sure .gitignore is correct
git status
git add .gitignore
git commit -m "Update .gitignore"

# Remove tracked files that should be ignored
git rm --cached backend/articles.db
git rm --cached backend/.env
git commit -m "Remove ignored files"
```

## Performance Issues

### Slow Scraping

**Symptoms:** Scraping takes a long time

**Solution:**
- Reduce `page_size` parameter when calling `/api/scrape`
- Check your internet connection speed
- Some articles may take longer to scrape

### Slow Frontend

**Symptoms:** Page loads slowly

**Solution:**
- Close other browser tabs
- Clear browser cache
- Check network tab for large assets
- Reduce animation settings if needed

## Log Locations

- **Backend logs:** Terminal where `uvicorn` is running
- **Frontend logs:** Browser console (F12) and terminal where `npm run dev` is running
- **Database:** `backend/articles.db` (SQLite file)
- **Logs:** Check terminal output for both servers

## Clean Start

If everything is broken and you want to start fresh:

```bash
# Clean backend
cd backend
rm -f articles.db *.db
rm -rf venv __pycache__
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Clean frontend (new terminal)
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```
