// GitHub action
// Copyright © 2026 Alexander Thoukydides

import { GitHub } from '@actions/github/lib/utils';

// GraphQL comments query result
export interface QueryCommentNode {
    id:             string,
    url:            string,
    body:           string,
    isMinimized:    boolean
}
interface QueryCommentsResponse {
    repository?: {
        issue?: {
            comments?: {
                nodes: QueryCommentNode[] | null
            }
        }
    }
}

// Retrieve the most recent comments (ordered from most recent to oldest)
export async function getRecentComments(
    github: InstanceType<typeof GitHub>,
    owner:  string,
    repo:   string,
    issue:  number
): Promise<QueryCommentNode[]> {
    const GRAPHQL_QUERY =
        `query($owner: String!, $repo: String!, $issue: Int!) {
            repository(owner: $owner, name: $repo) {
                issue(number: $issue) {
                    comments(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
                        nodes { id url body isMinimized }
                    }
                }
            }
        }`;
    const result = await github.graphql<QueryCommentsResponse>(GRAPHQL_QUERY, { owner, repo, issue });
    return result.repository?.issue?.comments?.nodes ?? [];
}

// Minimise a comment, marking it as OUTDATED
export async function minimiseComment(
    github: InstanceType<typeof GitHub>,
    id:     string
): Promise<void> {
    const GRAPHQL_MUTATION =
        `mutation($id: ID!) {
            minimizeComment(input: { classifier: OUTDATED, subjectId: $id }) {
                clientMutationId
            }
        }`;
    await github.graphql(GRAPHQL_MUTATION, { id });
}