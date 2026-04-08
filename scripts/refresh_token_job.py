#!/usr/bin/env python3
import argparse
import json
import os
import sys
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
        default=30,
        help="HTTP timeout in seconds (default: 30).",
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
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
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
