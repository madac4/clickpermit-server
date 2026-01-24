# Quick Fix for PDF Generation on Heroku

## Immediate Steps (Run these now):

### 1. Configure Buildpacks (Choose ONE method)

**Method A - CLI (Recommended):**
```bash
cd dispatcher-server
heroku buildpacks:clear -a your-app-name
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-google-chrome -a your-app-name
heroku buildpacks:add heroku/nodejs -a your-app-name
```

**Method B - Dashboard:**
1. Go to https://dashboard.heroku.com/apps/dispatcher-development-3983f578baf9/settings
2. Scroll to "Buildpacks"
3. Remove all existing buildpacks
4. Add these in order:
   - `https://github.com/heroku/heroku-buildpack-google-chrome`
   - `heroku/nodejs`

### 2. Deploy Updated Code

```bash
cd dispatcher-server
git add .
git commit -m "Fix: Configure Chrome for PDF generation on Heroku"
git push heroku main
```

### 3. Verify Deployment

Watch the build logs:
```bash
heroku logs --tail -a your-app-name
```

Look for:
- ✅ "Installing google-chrome..."
- ✅ "Using Chrome at: /app/.apt/usr/bin/google-chrome"
- ✅ "Using Puppeteer bundled Chrome at: ..."

### 4. Test PDF Generation

After deployment completes, test invoice download from your app.

## What Changed?

1. **`.buildpacks`** - Tells Heroku to install Chrome
2. **`Aptfile`** - Installs required Chrome dependencies
3. **`invoice.controller.ts`** - Smarter Chrome path detection with fallbacks
4. **`package.json`** - Cleaned up build scripts

## If It Still Doesn't Work

### Option 1: Check buildpack installation
```bash
heroku run bash -a your-app-name
# Inside the dyno:
which google-chrome
google-chrome --version
```

### Option 2: Try forcing Puppeteer Chrome download
```bash
heroku config:set PUPPETEER_SKIP_DOWNLOAD=false -a your-app-name
git push heroku main
```

### Option 3: Upgrade dyno (if memory issue)
```bash
heroku ps:resize web=standard-1x -a your-app-name
```

## Expected Behavior After Fix

When a user downloads an invoice PDF:
1. ✅ No error in logs
2. ✅ PDF file downloads successfully
3. ✅ Contains formatted invoice with all order details
4. ✅ Status 200 response (not 500)
