"use strict";
// GitHub action
// Copyright © 2026 Alexander Thoukydides
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = run;
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
const graphql_1 = require("./graphql");
// Script entry point
async function run(github) {
    const { owner, repo } = github_1.context.repo;
    // Action inputs
    const issue_number = Number(core.getInput('issue_number', { required: true }));
    const comment = core.getInput('body', { required: true });
    const marker = core.getInput('marker', { required: true });
    // Post the new comment
    const body = `${marker}\n${comment}`;
    await github.rest.issues.createComment({ owner, repo, issue_number, body });
    core.info(`Posted new comment:\n${body}`);
    // Retrieve previous comments with a matching marker that have not been minimised
    const comments = await (0, graphql_1.getRecentComments)(github, owner, repo, issue_number);
    const oldComments = comments
        .filter(({ body, isMinimized }) => body.includes(marker) && !isMinimized)
        .slice(1);
    // Minimise the selected comments
    for (const { id, url } of oldComments) {
        await (0, graphql_1.minimiseComment)(github, id);
        core.info(`Minimised comment: ${url}`);
    }
    if (oldComments.length)
        core.info(`Minimised ${oldComments.length} old comments`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdCQUFnQjtBQUNoQix5Q0FBeUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUXpDLHNCQXlCQztBQS9CRCw0Q0FBMEM7QUFFMUMsb0RBQXNDO0FBQ3RDLHVDQUErRDtBQUUvRCxxQkFBcUI7QUFDTixLQUFLLFVBQVUsR0FBRyxDQUFDLE1BQW1DO0lBQ2pFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsZ0JBQU8sQ0FBQyxJQUFJLENBQUM7SUFFckMsZ0JBQWdCO0lBQ2hCLE1BQU0sWUFBWSxHQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEYsTUFBTSxPQUFPLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRSxNQUFNLE1BQU0sR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLHVCQUF1QjtJQUN2QixNQUFNLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxPQUFPLEVBQUUsQ0FBQztJQUNyQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUUsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUUxQyxpRkFBaUY7SUFDakYsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLDJCQUFpQixFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzVFLE1BQU0sV0FBVyxHQUFHLFFBQVE7U0FDdkIsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDeEUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWQsaUNBQWlDO0lBQ2pDLEtBQUssTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUNwQyxNQUFNLElBQUEseUJBQWUsRUFBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ0QsSUFBSSxXQUFXLENBQUMsTUFBTTtRQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxXQUFXLENBQUMsTUFBTSxlQUFlLENBQUMsQ0FBQztBQUN0RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2l0SHViIGFjdGlvblxuLy8gQ29weXJpZ2h0IMKpIDIwMjYgQWxleGFuZGVyIFRob3VreWRpZGVzXG5cbmltcG9ydCB7IGNvbnRleHQgfSBmcm9tICdAYWN0aW9ucy9naXRodWInO1xuaW1wb3J0IHsgR2l0SHViIH0gZnJvbSAnQGFjdGlvbnMvZ2l0aHViL2xpYi91dGlscyc7XG5pbXBvcnQgKiBhcyBjb3JlIGZyb20gJ0BhY3Rpb25zL2NvcmUnO1xuaW1wb3J0IHsgbWluaW1pc2VDb21tZW50LCBnZXRSZWNlbnRDb21tZW50cyB9IGZyb20gJy4vZ3JhcGhxbCc7XG5cbi8vIFNjcmlwdCBlbnRyeSBwb2ludFxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcnVuKGdpdGh1YjogSW5zdGFuY2VUeXBlPHR5cGVvZiBHaXRIdWI+KSB7XG4gICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gY29udGV4dC5yZXBvO1xuXG4gICAgLy8gQWN0aW9uIGlucHV0c1xuICAgIGNvbnN0IGlzc3VlX251bWJlciAgPSBOdW1iZXIoY29yZS5nZXRJbnB1dCgnaXNzdWVfbnVtYmVyJywgeyByZXF1aXJlZDogdHJ1ZSB9KSk7XG4gICAgY29uc3QgY29tbWVudCAgICAgICA9IGNvcmUuZ2V0SW5wdXQoJ2JvZHknLCB7IHJlcXVpcmVkOiB0cnVlIH0pO1xuICAgIGNvbnN0IG1hcmtlciAgICAgICAgPSBjb3JlLmdldElucHV0KCdtYXJrZXInLCB7IHJlcXVpcmVkOiB0cnVlIH0pO1xuXG4gICAgLy8gUG9zdCB0aGUgbmV3IGNvbW1lbnRcbiAgICBjb25zdCBib2R5ID0gYCR7bWFya2VyfVxcbiR7Y29tbWVudH1gO1xuICAgIGF3YWl0IGdpdGh1Yi5yZXN0Lmlzc3Vlcy5jcmVhdGVDb21tZW50KHsgb3duZXIsIHJlcG8sIGlzc3VlX251bWJlciwgYm9keSB9KTtcbiAgICBjb3JlLmluZm8oYFBvc3RlZCBuZXcgY29tbWVudDpcXG4ke2JvZHl9YCk7XG5cbiAgICAvLyBSZXRyaWV2ZSBwcmV2aW91cyBjb21tZW50cyB3aXRoIGEgbWF0Y2hpbmcgbWFya2VyIHRoYXQgaGF2ZSBub3QgYmVlbiBtaW5pbWlzZWRcbiAgICBjb25zdCBjb21tZW50cyA9IGF3YWl0IGdldFJlY2VudENvbW1lbnRzKGdpdGh1Yiwgb3duZXIsIHJlcG8sIGlzc3VlX251bWJlcik7XG4gICAgY29uc3Qgb2xkQ29tbWVudHMgPSBjb21tZW50c1xuICAgICAgICAuZmlsdGVyKCh7IGJvZHksIGlzTWluaW1pemVkIH0pID0+IGJvZHkuaW5jbHVkZXMobWFya2VyKSAmJiAhaXNNaW5pbWl6ZWQpXG4gICAgICAgIC5zbGljZSgxKTtcblxuICAgIC8vIE1pbmltaXNlIHRoZSBzZWxlY3RlZCBjb21tZW50c1xuICAgIGZvciAoY29uc3QgeyBpZCwgdXJsIH0gb2Ygb2xkQ29tbWVudHMpIHtcbiAgICAgICAgYXdhaXQgbWluaW1pc2VDb21tZW50KGdpdGh1YiwgaWQpO1xuICAgICAgICBjb3JlLmluZm8oYE1pbmltaXNlZCBjb21tZW50OiAke3VybH1gKTtcbiAgICB9XG4gICAgaWYgKG9sZENvbW1lbnRzLmxlbmd0aCkgY29yZS5pbmZvKGBNaW5pbWlzZWQgJHtvbGRDb21tZW50cy5sZW5ndGh9IG9sZCBjb21tZW50c2ApO1xufSJdfQ==