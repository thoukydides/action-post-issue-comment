// GitHub action
// Copyright © 2026 Alexander Thoukydides

import { context, getOctokit } from '@actions/github';
import * as core from '@actions/core';
import { minimiseComment, getRecentComments } from './graphql.js';
import { updateLabels } from './labels.js';

// Script entry point
async function run() {
    // Action inputs
    const issue_number      = Number(core.getInput          ('issue_number',        { required: true }));
    const comment           =        core.getInput          ('body',                { required: false });
    const marker            =        core.getInput          ('marker',              { required: true });
    const labels_set        =        core.getInput          ('labels_set',          { required: false });
    const labels_remove     =        core.getInput          ('labels_remove',       { required: false });
    const labels_add        =        core.getInput          ('labels_add',          { required: false });
    const close_issue       =        core.getBooleanInput   ('close_issue',         { required: true });
    const workflow_summary  =        core.getBooleanInput   ('workflow_summary',    { required: true });
    const token             =        core.getInput          ('github_token',        { required: true });
    const dry_run           =        core.getBooleanInput   ('dry_run',             { required: true });

    // Create an authenticated GitHub client
    const github = getOctokit(token);
    const { owner, repo } = context.repo;

    // Add the comment to the workflow summary
    if (comment && workflow_summary) {
        const { title, html_url } = (await github.rest.issues.get({ owner, repo, issue_number })).data;
        await core.summary
            .addHeading(`${title} [#${issue_number}](${html_url})`, 3)
            .addRaw(comment, true)
            .write();
    }

    // Exit early if no action required
    if (dry_run) {
        core.info('Dry-run; exiting early');
        return;
    }

    // Add the comment to the issue and minimise any previously added comments
    if (comment) {
        // Post the new comment
        const body = `${marker}\n${comment}`;
        await github.rest.issues.createComment({ owner, repo, issue_number, body });
        core.info(`Posted new comment:\n${body}`);

        // Retrieve previous comments with a matching marker that have not been minimised
        const comments = await getRecentComments(github, owner, repo, issue_number);
        const oldComments = comments
            .filter(({ body, isMinimized }) => body.includes(marker) && !isMinimized)
            .slice(1);

        // Minimise the selected comments
        for (const { id, url } of oldComments) {
            await minimiseComment(github, id);
            core.info(`Minimised comment: ${url}`);
        }
        if (oldComments.length) core.info(`Minimised ${oldComments.length} old comments`);
    }

    // Update labels if required
    const labelsOptions = { labels_set, labels_remove, labels_add };
    await updateLabels(github, issue_number, labelsOptions);

    // Close the issue if required
    if (close_issue) {
        await github.rest.issues.update({ owner, repo, issue_number, state: 'closed' });
        core.info(`Closed issue #${issue_number}`);
    }

}

// Run the script and handle errors
try {
    await run();
} catch (err) {
    core.setFailed(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
    if (err instanceof Error && err.stack) core.debug(err.stack);
}