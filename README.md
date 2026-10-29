# SonicFlow — Vercel-ready media toolkit

Premium Next.js starter with:
- Responsive dark UI
- Video URL form with URL/domain validation and an explicit provider-integration status
- Local browser video-to-WAV extraction using the Web Audio API
- Music search, preview playback (where available), and official track pages via the iTunes Search API

## Run locally
1. Install Node.js 20 or later.
2. Extract this folder and open a terminal in it.
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:3000`

## Deploy to Vercel
1. Upload this project to a GitHub repository.
2. In Vercel, select **Add New → Project**, import that repository.
3. Keep the framework preset as **Next.js** and click **Deploy**.

## Important functionality notes
### Social video link downloads
The URL form currently validates supported domains but does not download videos. You need a legitimate provider/API integration in `app/api/resolve/route.ts` (not included) and must comply with the platforms' terms, copyright, privacy, and access restrictions. Do not expose provider API secrets in client-side code. A Vercel serverless function is the right place for a provider integration, but it may not be suitable for large media proxying because of execution and response-size limits. Prefer provider-supplied authorized download URLs rather than proxying entire videos through Vercel.

### Video-to-audio
Runs locally in the browser and exports WAV. It does not upload the selected file. Browser codecs vary; unsupported files may fail to decode, and large files can use considerable memory. WAV output can be large.

### Music finder
Searches Apple's public iTunes Search API, provides previews where the catalogue includes them, and links to official track pages. It does not provide unauthorized full-track downloads.

## Suggested next step for real downloads
Choose a provider that explicitly authorizes the requested use, then add its API endpoint and credentials as Vercel environment variables. Never put secrets in `NEXT_PUBLIC_*` variables.
