#!/usr/bin/env python3
import argparse
import json
import os
import ssl
import sys
import time
import urllib.error
import urllib.request


def wait_for_service(url, timeout, ssl_context):
    print("Waiting for service to become ready...")
    start = time.time()

    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=10, context=ssl_context) as r:
                if 200 <= r.status < 300:
                    print("Service is ready.")
                    return True
        except Exception as e:
            print(f"Still waiting... ({e})")

        time.sleep(5)

    return False


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
        default=120,
        help="HTTP timeout in seconds (default: 120).",
    )
    parser.add_argument(
        "--startup-timeout",
        type=int,
        default=240,
        help="Max seconds to wait for service health before sending refresh request (default: 240).",
    )
    parser.add_argument(
        "--retry-delay",
        type=int,
        default=20,
        help="Seconds to wait between refresh retries (default: 20).",
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
                    "startupTimeout": args.startup_timeout,
                    "retryDelay": args.retry_delay,
                    "secretProvided": True,
                }
            )
        )
        return 0

    # Create SSL context (NOTE: disabling verification is not recommended for prod)
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    # Prepare URLs
    base_url = refresh_url.rsplit("/api/", 1)[0]
    health_url = base_url + "/api/health"

    print("Waking up Render service...")

    # Initial wake attempt
    wake_req = urllib.request.Request(health_url, method="GET")
    try:
        with urllib.request.urlopen(wake_req, timeout=10, context=ssl_context):
            print("Initial wake request sent.")
    except Exception as e:
        print(f"Initial wake failed (expected on cold start): {e}")

    # Wait until service is actually ready
    if not wait_for_service(health_url, args.startup_timeout, ssl_context):
        print(
            f"ERROR: Service did not become ready within {args.startup_timeout} seconds.",
            file=sys.stderr,
        )
        return 1

    print("Sending token refresh request...")

    request = urllib.request.Request(
        refresh_url,
        method="POST",
        headers={
            "x-refresh-secret": refresh_secret,
            "Content-Type": "application/json",
        },
        data=b"{}",
    )

    max_attempts = 3

    for attempt in range(max_attempts):
        try:
            print(f"Attempt {attempt + 1}/{max_attempts}...")

            with urllib.request.urlopen(
                request, timeout=args.timeout, context=ssl_context
            ) as response:
                body = response.read().decode("utf-8")
                print(f"Status: {response.status}")
                print(body)

                if 200 <= response.status < 300:
                    print("Token refresh succeeded.")
                    return 0
                else:
                    print("Non-2xx response, will retry...")

        except urllib.error.HTTPError as err:
            body = err.read().decode("utf-8", errors="replace")
            print(f"HTTPError: {err.code}")
            print(body[:800])

        except urllib.error.URLError as err:
            print(f"URLError: {err.reason}")

        except Exception as e:
            print(f"Unexpected error: {e}")

        if attempt < max_attempts - 1:
            print(f"Retrying in {args.retry_delay} seconds...")
            time.sleep(args.retry_delay)

    print("ERROR: All attempts failed.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
