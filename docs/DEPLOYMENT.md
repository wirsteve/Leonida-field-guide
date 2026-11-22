# Deploying & installing on iPhone

No computer or terminal needed. Everything below works from Safari on an iPhone.

## 1. Deploy to Vercel (one time, ~3 minutes)

1. Open **vercel.com** in Safari and sign in with GitHub.
2. Tap **Add New… → Project**.
3. Find **Leonida-field-guide** under *Import Git Repository*. If it isn't listed, tap *Adjust GitHub App Permissions* and give Vercel access to that repository.
4. Leave every setting at its default. Vercel detects Next.js, and **no environment variables are needed**.
5. Tap **Deploy**. When it finishes, Vercel shows your URL, e.g. `https://leonida-field-guide.vercel.app`.

From then on, every merge to `main` redeploys automatically. Pull requests get their own preview URLs.

Cost: Vercel's free Hobby plan is enough. The app uses no paid APIs, no database and no AI key.

## 2. Install on your Home Screen

1. Open your Vercel URL in **Safari**. Other browsers on iOS can't install web apps the same way.
2. Tap the **Share** button (square with an arrow).
3. Scroll down and tap **Add to Home Screen**, then **Add**.
4. Launch **Field Guide** from the Home Screen. It opens full-screen, like a native app.

## 3. Your progress

- Progress is stored **on your iPhone** (IndexedDB) for the site you installed. It survives app updates and refreshes.
- Each install keeps its own data. The Home Screen app and a Safari tab of the same site may not share storage on iOS, so use the Home Screen app consistently.
- **Back up** from *Journal → Backup → Export* now and then. Restore with *Import* (preview → Merge or Replace).
- iOS may clear website data for sites you haven't opened in several weeks. Exported backups protect you against that.
- The guide can't read your PS5/Xbox save. It only knows what you record in it.

## 4. Updating guide content

Guide research lives in `src/content/guide/` and ships with each deploy. Updating it never touches your progress. Ids the guide doesn't know are ignored, not deleted.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Showing your last saved guide" banner | You're offline. The app shows the last view the server authorized. Reconnect and tap Retry. |
| Progress missing after reinstall | Deleting the Home Screen app deletes its storage. Import your last backup. |
| Old version still showing | Close the app fully (swipe it away) and reopen. The new version loads on the next launch. |
| Site didn't update after a merge | Vercel occasionally misses a push from GitHub. The next merge to `main` redeploys, or use *Deployments → ⋯ → Redeploy* in Vercel. |
