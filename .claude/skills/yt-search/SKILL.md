---
name: yt-search
description: Search YouTube and return recent or trending videos (title, channel, views, upload date, URL) as JSON via yt-dlp. Use when the user asks to find YouTube videos on a topic, e.g. "find the latest videos on X", often as a first step before sending the URLs to NotebookLM with the notebooklm skill.
---

# YouTube Search

Search YouTube with `yt-dlp` (no API key) and return a ranked list of videos.

## Setup

```bash
pip install yt-dlp   # once per environment
```

## Usage

```bash
python3 .claude/skills/yt-search/scripts/yt_search.py "claude code skills" --limit 10 --sort recent
```

Options:
- `--limit N` number of videos to return (default 10)
- `--sort relevance|recent|views` (default `relevance`). `recent` fetches full metadata to get upload dates and is slower.
- `--months N` with `--sort recent` or `views`, drop videos older than N months (default 6)

Output is a JSON array of `{title, channel, url, views, upload_date, duration}`.

## Workflow

1. Run the script and show the user a short table (title, channel, date, views).
2. When the user wants NotebookLM analysis, pass the `url` values to the notebooklm skill
   (`notebooklm source add <url>` for each, in a new notebook).

YouTube may rate-limit cloud IPs. If yt-dlp reports "Sign in to confirm you're not a bot",
retry with `--sort relevance` (flat search is lighter) or tell the user.
