# Deploying jsonmap

jsonmap is a small Node.js / Express app backed by MongoDB. It needs two things to run
in production:

1. A **MongoDB** instance.
2. A handful of **environment variables** (see [`.env.example`](./.env.example)).

The app already reads `process.env.PORT` and binds to it, so it works on any provider that
injects a port at runtime (Railway, Render, Fly.io, Heroku, etc.). The instructions below
focus on **Railway**, with notes for other providers at the end.

## What the app expects

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | Yes (prod) | MongoDB connection string. Also **enables the HTTP→HTTPS redirect** middleware. Defaults to `mongodb://127.0.0.1:27017/restore_db` when unset. |
| `PORT` | No | Port to bind. Injected automatically by most PaaS. Falls back to `3000`. |
| `NODE_ENV` | No | Set to `development` to disable the HTTPS redirect. Leave as `production` when deployed. |
| `SLOWMO` | No | Demo-only: adds a random request delay when set. Leave unset in prod. |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | No | Where to ship OpenTelemetry traces. If unset, tracing tries `localhost:4318`, times out after 2s, and the app continues normally. |
| `OTEL_EXPORTER_OTLP_HEADERS` | No | Auth header(s) for the OTLP endpoint, e.g. `authorization=Bearer <token>`. |
| `OTEL_SERVICE_NAME` | No | Service name shown in traces (e.g. `jsonmap`). |

Prometheus metrics are exposed at **`/metrics`** and require no configuration.

---

## Deploy to Railway

### Option A — Deploy from the dashboard (recommended)

1. **Push this repo to GitHub** (Railway deploys from a repo).
2. Go to [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub repo**,
   and pick this repository. Railway auto-detects Node.js and builds it with Nixpacks using
   the `npm start` script. (A [`railway.json`](./railway.json) in the repo pins this config.)
3. **Add a database:** in the project canvas, click **New** → **Database** → **Add MongoDB**.
   Railway provisions it and exposes a `MONGO_URL` variable on the database service.
4. **Wire the app to the database.** Open your app service → **Variables** and add a
   [reference variable](https://docs.railway.com/guides/variables#reference-variables):

   ```
   DB_URL=${{ MongoDB.MONGO_URL }}
   ```

   > The variable is named `MONGO_URL` on the DB service; the app reads `DB_URL`, so this
   > line maps one to the other. If you named your database service something other than
   > `MongoDB`, use that name inside `${{ ... }}`.
5. (Optional) Add the OTel variables from the table above if you want to ship traces.
6. **Generate a public domain:** app service → **Settings** → **Networking** →
   **Generate Domain**. Railway terminates TLS for you, so the app's HTTPS-redirect
   middleware works out of the box.
7. Railway redeploys on every push to your default branch. Visit the generated URL — you
   should see the jsonmap landing page, and `/metrics` should return Prometheus output.

### Option B — Deploy from the CLI

```bash
npm i -g @railway/cli
railway login
railway init            # create/link a project
railway add             # add a MongoDB database when prompted
railway up              # build & deploy the current directory
```

Then set the reference variable (or do it in the dashboard):

```bash
railway variables --set 'DB_URL=${{ MongoDB.MONGO_URL }}'
```

### Notes

- **Node version:** Railway's Nixpacks defaults to a current LTS Node. To pin a version,
  add an `engines.node` field to `package.json` or a `.nvmrc` file.
- **Private networking:** app and database live in the same project, so traffic between
  them stays on Railway's private network — no need to expose the DB publicly.
- **Health:** the app logs `restore listening on port <PORT>` and `DB connection established`
  on a successful boot. If the DB URL is wrong, Mongoose connection errors show in the
  deploy logs.

---

## Other providers

The app is provider-agnostic; only the wiring differs.

- **Render:** New → Web Service → connect repo. Build command `npm install`, start command
  `npm start`. Add a MongoDB (Render doesn't host Mongo natively — use
  [MongoDB Atlas](https://www.mongodb.com/atlas) and set `DB_URL` to the Atlas SRV string).
- **Fly.io:** `fly launch` (detects Node), then `fly secrets set DB_URL=...`. Use Atlas or a
  Fly Mongo machine. Fly provides TLS on `*.fly.dev`.
- **Heroku:** `heroku create`, add a Mongo add-on or Atlas, `heroku config:set DB_URL=...`.
  The HTTPS-redirect middleware already handles Heroku's `x-forwarded-proto` header.

For any of these: set `DB_URL` to a reachable MongoDB connection string, let the platform
inject `PORT`, and (optionally) set the `OTEL_*` variables to ship traces.
