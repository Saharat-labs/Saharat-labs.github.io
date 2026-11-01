#!/usr/bin/env python3
"""Search YouTube with yt-dlp and print matching videos as JSON."""
import argparse
import json
import subprocess
from urllib.parse import quote_plus
import sys
from datetime import datetime, timedelta


def run_ytdlp(args):
    out = subprocess.run(["yt-dlp", "--quiet", "--no-warnings", "--ignore-errors", *args],
                         capture_output=True, text=True)
    return [json.loads(line) for line in out.stdout.splitlines() if line.strip()]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("query")
    p.add_argument("--limit", type=int, default=10)
    p.add_argument("--sort", choices=["relevance", "recent", "views"], default="relevance")
    p.add_argument("--months", type=int, default=6)
    a = p.parse_args()

    if a.sort == "relevance":
        items = run_ytdlp(["--flat-playlist", "--dump-json", f"ytsearch{a.limit}:{a.query}"])
    else:
        # Pull a wider pool with full metadata so upload dates are available.
        # sp=CAI= sorts YouTube results by upload date, sp=CAM= by view count.
        sp = "CAI%253D" if a.sort == "recent" else "CAM%253D"
        url = f"https://www.youtube.com/results?search_query={quote_plus(a.query)}&sp={sp}"
        items = run_ytdlp(["--skip-download", "--dump-json", "--playlist-end", str(a.limit * 3), url])
        cutoff = (datetime.now() - timedelta(days=30 * a.months)).strftime("%Y%m%d")
        items = [v for v in items if (v.get("upload_date") or "0") >= cutoff]
        key = "upload_date" if a.sort == "recent" else "view_count"
        items.sort(key=lambda v: v.get(key) or 0, reverse=True)
        items = items[:a.limit]

    videos = [{
        "title": v.get("title"),
        "channel": v.get("channel") or v.get("uploader"),
        "url": v.get("webpage_url") or v.get("url"),
        "views": v.get("view_count"),
        "upload_date": v.get("upload_date"),
        "duration": v.get("duration"),
    } for v in items]
    json.dump(videos, sys.stdout, ensure_ascii=False, indent=2)
    print()


if __name__ == "__main__":
    main()
