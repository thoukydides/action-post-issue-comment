# `action-post-issue-comment`

This action posts a new comment to an issue, and minimises (as `OUTDATED`) any previous comments that include a matching marker string.

> [!CAUTION]
> This action is provided for my own use and published in case it is useful to others. If you rely on it, fork and maintain your own copy. No support or stability guarantees are offered.

## Prerequisites

Before using this workflow, ensure:
- The workflow has `issues: write` permission (either via the default `GITHUB_TOKEN` or a fine-grained token).

## Inputs

Various inputs are defined in the action to configure its operation:

| Name | Description | Default
| --- | --- | ---
| `issue_number` | The GitHub issue to comment on | *required*
| `body` | The comment body to add | *required*
| `marker` | A prefix for the comment body, used to identify previous comments to be minimised | `'<!-- bot-comment -->'`

## Usage

Example workflow to add a comment when an issue is opened:

```yaml
name: Opened Issue Response
permissions:
  issues: write

on:
  issues:
    types: [opened]

jobs:
  opened-issue-comment:
    runs-on: ubuntu-latest

    steps:
      - name: Add a comment to new issues
        uses: thoukydides/action-post-issue-comment@v1
        with:
          issue_number: ${{ github.event.issue.number }}
          body: |
            Thanks for opening an issue here.
            Be sure to follow the contribution guidelines and issue template!
          marker: `'<!-- opened-issue-comment -->'`
```

## ISC License (ISC)

<details>
<summary>Copyright © 2026 Alexander Thoukydides</summary>

> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
</details>