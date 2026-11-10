# Deploy to Vercel

1. Push the project to a GitHub repository. Include `index.html`, `src/`, `public/`, `package.json`, and `package-lock.json`. Do not upload `node_modules/` or `dist/`.
2. In [Vercel](https://vercel.com), select **Add New Project** and import the repository.
3. Confirm these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework | Vite |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `dist` |

4. Deploy and open the URL provided by Vercel. Push future changes to the connected branch to redeploy.

The invitation is publicly accessible by default. A private GitHub repository does not make the deployed site private; configure hosting access control before publishing private information.

For a custom domain, add it under the project's **Settings → Domains** and follow Vercel's DNS instructions.
