// GitHub action
// Copyright © 2026 Alexander Thoukydides

import { context, getOctokit } from '@actions/github';
import * as core from '@actions/core';
import { minimiseComment, getRecentComments } from './graphql.js';

// Script entry point
async function run() {

    // Action inputs
    const issue_number  = Number(core.getInput('issue_number', { required: true }));
    const comment       = core.getInput('body',         { required: true });
    const marker        = core.getInput('marker',       { required: true });
    const token         = core.getInput('github_token', { required: true });

    // Create an authenticated GitHub client
    const github = getOctokit(token);
    const { owner, repo } = context.repo;

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

// Run the script and handle errors
try {
    await run();
} catch (err) {
    core.setFailed(err instanceof Error ? `${err.name}: ${err.message}` : String(err));
    if (err instanceof Error && err.stack) core.debug(err.stack);
}