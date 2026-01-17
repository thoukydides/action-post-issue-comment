// GitHub action
// Copyright © 2026 Alexander Thoukydides

import { context } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils.js';
import * as core from '@actions/core';
import { minimiseComment, getRecentComments } from './graphql.js';

// Script entry point
export default async function run(github: InstanceType<typeof GitHub>) {
    const { owner, repo } = context.repo;

    // Action inputs
    const issue_number  = Number(core.getInput('issue_number', { required: true }));
    const comment       = core.getInput('body', { required: true });
    const marker        = core.getInput('marker', { required: true });

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