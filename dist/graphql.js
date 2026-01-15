"use strict";
// GitHub action
// Copyright © 2026 Alexander Thoukydides
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentComments = getRecentComments;
exports.minimiseComment = minimiseComment;
// Retrieve the most recent comments (ordered from most recent to oldest)
async function getRecentComments(github, owner, repo, issue) {
    const GRAPHQL_QUERY = `query($owner: String!, $repo: String!, $issue: Int!) {
            repository(owner: $owner, name: $repo) {
                issue(number: $issue) {
                    comments(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
                        nodes { id url body isMinimized }
                    }
                }
            }
        }`;
    const result = await github.graphql(GRAPHQL_QUERY, { owner, repo, issue });
    return result.repository?.issue?.comments?.nodes ?? [];
}
// Minimise a comment, marking it as OUTDATED
async function minimiseComment(github, id) {
    const GRAPHQL_MUTATION = `mutation($id: ID!) {
            minimizeComment(input: { classifier: OUTDATED, subjectId: $id }) {
                clientMutationId
            }
        }`;
    await github.graphql(GRAPHQL_MUTATION, { id });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnQkFBZ0I7QUFDaEIseUNBQXlDOztBQXNCekMsOENBa0JDO0FBR0QsMENBV0M7QUFqQ0QseUVBQXlFO0FBQ2xFLEtBQUssVUFBVSxpQkFBaUIsQ0FDbkMsTUFBbUMsRUFDbkMsS0FBYyxFQUNkLElBQWMsRUFDZCxLQUFjO0lBRWQsTUFBTSxhQUFhLEdBQ2Y7Ozs7Ozs7O1VBUUUsQ0FBQztJQUNQLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBd0IsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xHLE9BQU8sTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDM0QsQ0FBQztBQUVELDZDQUE2QztBQUN0QyxLQUFLLFVBQVUsZUFBZSxDQUNqQyxNQUFtQyxFQUNuQyxFQUFjO0lBRWQsTUFBTSxnQkFBZ0IsR0FDbEI7Ozs7VUFJRSxDQUFDO0lBQ1AsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNuRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2l0SHViIGFjdGlvblxuLy8gQ29weXJpZ2h0IMKpIDIwMjYgQWxleGFuZGVyIFRob3VreWRpZGVzXG5cbmltcG9ydCB7IEdpdEh1YiB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yi9saWIvdXRpbHMnO1xuXG4vLyBHcmFwaFFMIGNvbW1lbnRzIHF1ZXJ5IHJlc3VsdFxuZXhwb3J0IGludGVyZmFjZSBRdWVyeUNvbW1lbnROb2RlIHtcbiAgICBpZDogICAgICAgICAgICAgc3RyaW5nLFxuICAgIHVybDogICAgICAgICAgICBzdHJpbmcsXG4gICAgYm9keTogICAgICAgICAgIHN0cmluZyxcbiAgICBpc01pbmltaXplZDogICAgYm9vbGVhblxufVxuaW50ZXJmYWNlIFF1ZXJ5Q29tbWVudHNSZXNwb25zZSB7XG4gICAgcmVwb3NpdG9yeT86IHtcbiAgICAgICAgaXNzdWU/OiB7XG4gICAgICAgICAgICBjb21tZW50cz86IHtcbiAgICAgICAgICAgICAgICBub2RlczogUXVlcnlDb21tZW50Tm9kZVtdIHwgbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBSZXRyaWV2ZSB0aGUgbW9zdCByZWNlbnQgY29tbWVudHMgKG9yZGVyZWQgZnJvbSBtb3N0IHJlY2VudCB0byBvbGRlc3QpXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UmVjZW50Q29tbWVudHMoXG4gICAgZ2l0aHViOiBJbnN0YW5jZVR5cGU8dHlwZW9mIEdpdEh1Yj4sXG4gICAgb3duZXI6ICBzdHJpbmcsXG4gICAgcmVwbzogICBzdHJpbmcsXG4gICAgaXNzdWU6ICBudW1iZXJcbik6IFByb21pc2U8UXVlcnlDb21tZW50Tm9kZVtdPiB7XG4gICAgY29uc3QgR1JBUEhRTF9RVUVSWSA9XG4gICAgICAgIGBxdWVyeSgkb3duZXI6IFN0cmluZyEsICRyZXBvOiBTdHJpbmchLCAkaXNzdWU6IEludCEpIHtcbiAgICAgICAgICAgIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJHJlcG8pIHtcbiAgICAgICAgICAgICAgICBpc3N1ZShudW1iZXI6ICRpc3N1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb21tZW50cyhmaXJzdDogMTAwLCBvcmRlckJ5OiB7IGZpZWxkOiBVUERBVEVEX0FULCBkaXJlY3Rpb246IERFU0MgfSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXMgeyBpZCB1cmwgYm9keSBpc01pbmltaXplZCB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1gO1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdpdGh1Yi5ncmFwaHFsPFF1ZXJ5Q29tbWVudHNSZXNwb25zZT4oR1JBUEhRTF9RVUVSWSwgeyBvd25lciwgcmVwbywgaXNzdWUgfSk7XG4gICAgcmV0dXJuIHJlc3VsdC5yZXBvc2l0b3J5Py5pc3N1ZT8uY29tbWVudHM/Lm5vZGVzID8/IFtdO1xufVxuXG4vLyBNaW5pbWlzZSBhIGNvbW1lbnQsIG1hcmtpbmcgaXQgYXMgT1VUREFURURcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaW5pbWlzZUNvbW1lbnQoXG4gICAgZ2l0aHViOiBJbnN0YW5jZVR5cGU8dHlwZW9mIEdpdEh1Yj4sXG4gICAgaWQ6ICAgICBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IEdSQVBIUUxfTVVUQVRJT04gPVxuICAgICAgICBgbXV0YXRpb24oJGlkOiBJRCEpIHtcbiAgICAgICAgICAgIG1pbmltaXplQ29tbWVudChpbnB1dDogeyBjbGFzc2lmaWVyOiBPVVREQVRFRCwgc3ViamVjdElkOiAkaWQgfSkge1xuICAgICAgICAgICAgICAgIGNsaWVudE11dGF0aW9uSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWA7XG4gICAgYXdhaXQgZ2l0aHViLmdyYXBocWwoR1JBUEhRTF9NVVRBVElPTiwgeyBpZCB9KTtcbn0iXX0=