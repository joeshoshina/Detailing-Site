#!/usr/bin/env python3
import argparse
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Trigger protected refresh endpoint for Instagram token rotation."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print request details without sending the HTTP request.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=90,
        help="HTTP timeout in seconds (default: 90).",
    )
    args = parser.parse_args()

    refresh_url = os.getenv("REFRESH_URL")
    refresh_secret = os.getenv("REFRESH_SECRET")

    if not refresh_url:
        print("ERROR: REFRESH_URL is not set.", file=sys.stderr)
        return 1

    if not refresh_secret:
        print("ERROR: REFRESH_SECRET is not set.", file=sys.stderr)
        return 1

    if args.dry_run:
        print(
            json.dumps(
                {
                    "dryRun": True,
                    "url": refresh_url,
                    "timeout": args.timeout,
                    "secretProvided": True,
                }
            )
        )
        return 0

    # Create SSL context that doesn't verify certificates
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    # Wake up Render service first (free tier spins down after inactivity)
    base_url = refresh_url.rsplit("/api/", 1)[0]
    health_url = base_url + "/api/health"
    print(f"Waking up Render service...")
    wake_req = urllib.request.Request(health_url, method="GET")
    try:
        with urllib.request.urlopen(wake_req, timeout=args.timeout, context=ssl_context):
            pass
    except Exception:
        pass  # Even if health check fails, continue to main request
    print("Waiting 30 seconds for service to be ready...")
    time.sleep(30)

    print(f"Sending token refresh request...")
    request = urllib.request.Request(
        refresh_url,
        method="POST",
        headers={
            "x-refresh-secret": refresh_secret,
            "Content-Type": "application/json",
        },
        data=b"{}",
    )

    try:
        with urllib.request.urlopen(request, timeout=args.timeout, context=ssl_context) as response:
            body = response.read().decode("utf-8")
            print(f"Status: {response.status}")
            print(body)
            if response.status < 200 or response.status >= 300:
                return 1
            return 0
    except urllib.error.HTTPError as err:
        body = err.read().decode("utf-8", errors="replace")
        print(f"HTTPError: {err.code}", file=sys.stderr)
        print(body, file=sys.stderr)
        return 1
    except urllib.error.URLError as err:
        print(f"URLError: {err.reason}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
