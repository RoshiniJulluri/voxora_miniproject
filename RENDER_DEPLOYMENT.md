# Deploy VOXORA on Render

VOXORA's free Render Blueprint is in `render.yaml`. It defines a static React site and a free FastAPI web service. Free Render instances have ephemeral filesystems, so the setup uses a Supabase Free Postgres project for application data and Cloudflare R2 for generated audio. The frontend build reads the API's Render URL from the Blueprint and appends `/api/v1` at runtime.

## Before creating the Blueprint

1. Create a Supabase Free project. In its **Connect** dialog, select the **Session pooler** connection string for IPv4-compatible persistent services. Keep the connection string private.
2. Create a Cloudflare R2 bucket and an R2 API token scoped to that bucket with object read, write, and delete permissions. Note the account endpoint and access credentials.
3. Push the reviewed repository to a Git provider supported by Render. The current working branch is `roshini-development`.
4. In Render, choose **New → Blueprint** and connect the repository and branch containing `render.yaml`.
5. Enter `DATABASE_URL`, `GEMINI_API_KEY`, `MURF_API_KEY`, `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET` when Render prompts for them. These values are marked `sync: false`; they are not stored in this repository.
6. Review the plan before applying. The React static site and API use Render's free plans. There is no Render Postgres or Render disk in this setup.
7. Apply the Blueprint. Render builds the frontend and backend and runs database migrations before starting the API.

## After the first deploy

- Open the frontend URL and create an account.
- Check `https://<api-service>.onrender.com/api/v1/health` for `{"status":"ok","database":"connected"}`.
- If Render assigned the static site a URL other than `https://voxora-web.onrender.com`, update `FRONTEND_ORIGIN` on `voxora-api` to the exact static-site URL and redeploy the API.
- Generate a short podcast, play it, and confirm its audio remains available after an API restart.

## Notes

This can run without a paid hosting plan or paid AI API plan while all accounts remain within their free allowances. Gemini API offers free-tier access to selected models with limited rate quotas. Murf API's free trial currently includes 100,000 characters; generation stops when that allowance is exhausted unless you switch to a paid plan. Select a model available in Gemini's free tier and do not enable paid billing if you want a hard no-charge setup. Check current quotas before deploying because provider limits can change.

Render free web services can spin down after 15 minutes idle and may take about a minute to wake; they can restart and do not support persistent disks. Render may suspend free services at monthly usage limits when no payment method is on file. The Supabase Free database has a 500 MB limit and may pause after a week of low activity. Cloudflare R2 currently includes 10 GB-month of standard storage and free egress; usage beyond free quotas can incur charges. Keep billing disabled or usage alerts/limits enabled at each provider if you need to avoid unexpected charges.

The API uses FastAPI in-process background tasks, so keep it as one instance. A process restart during generation can lose that job; moving to a durable queue is a later scaling step.

Official provider references: [Render free services](https://render.com/docs/free), [Supabase free plan](https://supabase.com/pricing), [Supabase connection strings](https://supabase.com/docs/guides/database/connecting-to-postgres), [Cloudflare R2 free tier](https://developers.cloudflare.com/r2/pricing/), [Gemini API pricing and free tier](https://ai.google.dev/gemini-api/docs/pricing), and [Murf API plans and limits](https://help.murf.ai/murf-api-plans-and-limits).
