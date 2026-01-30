# `action-post-issue-comment`

This action can perform the following operations on a GitHub issue:
- Add a comment to the GitHub Actions workflow summary.
- Posts a new comment and minimises (as `OUTDATED`) any previous comments that include a matching marker string.
- Change the set of labels associated with the issue.
- Close the issue.

> [!CAUTION]
> This action is provided for my own use and published in case it is useful to others. If you rely on it, fork and maintain your own copy. No support or stability guarantees are offered.

## Prerequisites

Before using this workflow, ensure:
- The workflow has `issues: write` permission (either via the default `GITHUB_TOKEN` or a fine-grained token).

## Inputs

Various inputs are defined in the action to configure its operation:

| Name | Description | Default
| --- | --- | ---
| `issue_number` | The GitHub issue to modify | *required*
| `body` | The comment body to add; empty string to suppress adding a comment | `''`
| `marker` | A prefix for the comment body, used to identify previous comments to be minimised | `'<!-- bot-comment -->'`
| `labels_set` | Replace the set of labels on the issue with the provided set (JSON array of strings) | `''`
| `labels_remove` | Remove a list of labels from the issue (JSON array of strings) | `''`
| `labels_add` | Add a list of labels to the issue (JSON array of strings) | `''`
| `close_issue` | Should the issue be closed after applying all updates | `false`
| `github_token` | The GitHub token used to create an authenticated client | `${{ github.token }}`
| `workflow_postfix` | An optional link to the workflow run to append to the issue comment; empty string for none | `'Workflow run {{workflow}}'`
| `workflow_summary` | Should the comment body be added to the workflow summary | `true`
| `dry_run` | Disables actions that modify the issue (adding the comment, changing labels, minimising previous comments, or closing the issue) for testing | `false`

The `labels_*` inputs all take a JSON array of strings, e.g. `["stale", "invalid"]`. The labels are updated in the sequence `labels_set`, then `labels_remove`, and finally `labels_add`.

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
          marker: '<!-- opened-issue-comment -->'
          labels_add: '["triage-required"]'
```

## ISC License (ISC)

<details>
<summary>Copyright © 2026 Alexander Thoukydides</summary>

> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
</details>