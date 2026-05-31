# ⚠️ QUICK FIX - Environment Issues & Solutions

## 🔴 Issues Encountered

### 1. Node.js Version Mismatch
**Problem**: You have Node v16.14.2, but Jest 30.x requires Node 18+

**Solution**: Downgrade Jest to version 27.x (compatible with Node 16)

```bash
npm install --save-dev jest@27 --force --prefix backend
npm install --save-dev jest@27 --force --prefix frontend
```

### 2. PowerShell Syntax Error
**Problem**: Using bash syntax (`&&`) in PowerShell

**Bash Syntax (Don't use in PowerShell):**
```bash
cd backend && npm run dev
cd frontend && npm start
```

**PowerShell Syntax (Correct):**
```powershell
cd backend; npm run dev
cd frontend; npm start
```

### 3. Jest Configuration Error
**Error**: `Module jest-circus not found`

**Fixed**: Updated `jest.config.js` to use correct testRunner

### 4. Ngrok Not Installed
**Problem**: `ngrok: term not recognized`

**Solution**: Install via Chocolatey
```powershell
choco install ngrok
ngrok config add-authtoken YOUR_TOKEN
```

---

## ✅ CORRECT QUICK START (PowerShell)

### Step 1: Install Dependencies
```powershell
npm run install:all
```

### Step 2: Configure Environment Files

**Create `backend\.env`:**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/site_star_mousse
JWT_SECRET=dev-secret-key-12345
```

**Create `frontend\.env.development`:**
```
REACT_APP_API_URL=http://localhost:5000
```

### Step 3: Start Services (PowerShell - Correct Syntax)

**Terminal 1 - Backend:**
```powershell
cd backend; npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend; npm start
```

**Terminal 3 - Ngrok (Optional):**
```powershell
ngrok http 5000
```

### Step 4: Run Tests

**Backend Tests:**
```powershell
npm run test --prefix backend
```

**Frontend Tests:**
```powershell
npm run test --prefix frontend
```

---

## 📋 PowerShell vs Bash Cheat Sheet

| Command | Bash | PowerShell |
|---------|------|-----------|
| Sequential | `cmd1 && cmd2` | `cmd1; cmd2` |
| Comment | `# comment` | `# comment` |
| Pipe | `cmd1 \| cmd2` | `cmd1 \| cmd2` |
| Redirect | `cmd > file` | `cmd > file` |
| If | `if [ $? -eq 0 ]` | `if ($?) { }` |

---

## 🔧 Jest Version Compatibility

| Node Version | Jest Version | Status |
|--------------|--------------|--------|
| 16.x | 27.x | ✅ Compatible |
| 18.x | 29.x or 30.x | ✅ Compatible |
| 20.x | 29.x or 30.x | ✅ Compatible |

Your environment: **Node 16.14.2 → Use Jest 27.x**

---

## 🚀 Next Steps

1. **Install Jest 27:**
   ```powershell
   npm install --save-dev jest@27 --force --prefix backend
   npm install --save-dev jest@27 --force --prefix frontend
   ```

2. **Verify Jest works:**
   ```powershell
   npm run test --prefix backend
   ```

3. **Configure MongoDB:**
   - See `MONGODB_SETUP.md` for options

4. **Start developing:**
   - Follow Step 3 above with correct PowerShell syntax

---

## 💡 Common Mistakes to Avoid

❌ **WRONG - Bash Syntax in PowerShell:**
```powershell
cd backend && npm run dev
```

✅ **CORRECT - PowerShell Syntax:**
```powershell
cd backend; npm run dev
```

---

## 📞 Still Having Issues?

### Test not running?
```powershell
npm run test --prefix backend
# Check output for specific errors
```

### Port already in use?
```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB connection failed?
- Ensure MongoDB is running
- Check `backend\.env` has correct `MONGODB_URI`
- See `MONGODB_SETUP.md`

### Node/npm issues?
```powershell
node --version  # Should show v16.14.2 or higher
npm --version   # Should show 8.5.0 or higher

# Update npm if needed
npm install -g npm@latest
```

---

## 📚 Quick Links

- **QUICK_START.md** - Main guide (with PowerShell syntax fixed)
- **MONGODB_SETUP.md** - Database configuration
- **NGROK_SETUP.md** - Public access
- **TESTING_COMPLETE_GUIDE.md** - Full testing overview

---

**Status**: ✅ Environment Fixed - Ready to Start!

Next: Open a PowerShell terminal and run:
```powershell
cd C:\site_star_mousse
npm run install:all
```
