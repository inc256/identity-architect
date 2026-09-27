# Project ownership notes

- This repository is self-hosted and should not depend on Lovable-managed infrastructure.
- Keep Supabase, email, and deployment credentials in your own environment configuration.
- Use your own database, hosting, and SMTP or Resend keys instead of preview-only defaults.
- Keep migration SQL under the `drizzle/migrations` directory and apply it to the owner’s project before production deploys.
