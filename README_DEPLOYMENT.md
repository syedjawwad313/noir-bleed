# Deployment Instructions for React App on GitHub Pages

## Steps to Deploy

1. Ensure your `package.json` has the following fields:
   - `"homepage": "https://<your-github-username>.github.io/<repository-name>"`
   - Scripts:
     ```json
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
     ```
   - `gh-pages` as a devDependency.

2. In `vite.config.js`, set the base path:
   ```js
   export default defineConfig({
     base: "/<repository-name>/",
     plugins: [react()]
   });
   ```

3. Initialize git, commit your changes, and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/<your-github-username>/<repository-name>.git
   git push -u origin master
   ```

4. Deploy the app:
   ```bash
   npm run deploy
   ```

5. Configure GitHub Pages:
   - Go to your repository on GitHub.
   - Click on **Settings** > **Pages**.
   - Under **Source**, select **gh-pages** branch and root folder.
   - Save and wait a few minutes for deployment.

6. Access your live site at:
   ```
   https://<your-github-username>.github.io/<repository-name>/
   ```

## Troubleshooting

- If you see a blank page, ensure the `base` in `vite.config.js` matches your repository name.
- Make sure GitHub Pages is set to deploy from the `gh-pages` branch.
- Clear browser cache or try incognito mode.

---

Replace `<your-github-username>` and `<repository-name>` with your actual GitHub username and repository name.

This guide summarizes the deployment setup shown on your laptop screen.
