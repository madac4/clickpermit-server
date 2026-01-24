# Heroku Deployment Guide for PDF Generation

This app uses Puppeteer to generate PDF invoices. To deploy on Heroku, you need to configure Chrome properly.

## Required Buildpacks

You need to add two buildpacks in this order:

1. **Google Chrome Buildpack**
2. **Node.js Buildpack**

### Option 1: Using Heroku CLI

```bash
heroku buildpacks:clear
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-google-chrome
heroku buildpacks:add heroku/nodejs
```

### Option 2: Using Heroku Dashboard

1. Go to your app's Settings tab
2. Scroll to "Buildpacks" section
3. Click "Add buildpack"
4. Add these buildpacks in order:
    - `https://github.com/heroku/heroku-buildpack-google-chrome`
    - `heroku/nodejs`

### Option 3: Using .buildpacks file (Already configured)

The `.buildpacks` file in the root directory is already configured. Heroku will automatically use it.

## Environment Variables

Make sure these environment variables are set in Heroku:

```bash
# These are usually set automatically by the Chrome buildpack
GOOGLE_CHROME_BIN=/app/.apt/usr/bin/google-chrome
CHROME_BIN=/app/.apt/usr/bin/google-chrome

# Make sure these are also set (your existing vars)
NODE_ENV=production
FRONTEND_ORIGIN=your-frontend-url
# ... other environment variables
```

## Puppeteer Configuration

The app is configured to:

1. First try to use Puppeteer's bundled Chrome
2. Fall back to system Chrome at multiple possible locations
3. Use Chrome buildpack's installation path (`/app/.apt/usr/bin/google-chrome`)

## Deployment Steps

1. Make sure `.buildpacks` file exists (already created)
2. Make sure `Aptfile` exists (already created)
3. Commit changes:
    ```bash
    git add .
    git commit -m "Add Heroku Chrome configuration for PDF generation"
    ```
4. Deploy to Heroku:
    ```bash
    git push heroku main
    ```

## Troubleshooting

### If PDF generation still fails:

1. **Check buildpack order:**

    ```bash
    heroku buildpacks
    ```

    Chrome buildpack should be BEFORE Node.js buildpack.

2. **Check Chrome installation:**

    ```bash
    heroku run bash
    which google-chrome
    ls -la /app/.apt/usr/bin/google-chrome
    ```

3. **Check logs:**

    ```bash
    heroku logs --tail
    ```

    Look for messages like "Using Chrome at: ..."

4. **Verify environment variables:**
    ```bash
    heroku config
    ```

### Alternative: Use Puppeteer bundled Chrome

If Chrome buildpack doesn't work, you can ensure Puppeteer downloads Chrome during build:

```bash
heroku config:set PUPPETEER_SKIP_DOWNLOAD=false
```

Then redeploy.

## Resource Requirements

PDF generation requires more memory. Make sure your dyno has enough resources:

- **Minimum:** Standard-1X (512 MB RAM)
- **Recommended:** Standard-2X (1 GB RAM) or higher

To upgrade:

```bash
heroku ps:resize web=standard-1x
```

## Testing

After deployment, test the PDF download endpoint:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-app.herokuapp.com/api/invoices/INVOICE_ID/download \
  -o test.pdf
```

If it works, you should get a PDF file.
