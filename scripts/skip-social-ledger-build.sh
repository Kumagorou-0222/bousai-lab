#!/bin/sh
if [ "${VERCEL_GIT_COMMIT_REF:-}" = "social-ledger" ]; then
  exit 0
fi
exit 1
