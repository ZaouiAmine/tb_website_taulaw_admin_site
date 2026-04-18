#!/bin/sh
# Backend API is on taulaw_backend_domain; this site is on taulaw_admin_domain.
# Without VITE_* at build time, axios falls back to same-origin and /auth/login 404s on the static host.
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-https://tyx9xuts0.gen.aventr.cloud}"
export VITE_BASE_IMAGE_URL="${VITE_BASE_IMAGE_URL:-https://tyx9xuts0.gen.aventr.cloud}"

npm install
npm run build
cp -r dist/. /out/
