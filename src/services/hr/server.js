import "server-only";

export {
  fetchHrJobs,
  fetchHrJobById,
  fetchHrJobBySlugOrId,
  createHrJob,
  updateHrJob,
  deleteHrJob,
} from "./jobs/jobs-admin-service";

export {
  fetchHrCandidates,
  updateCandidateStage,
  addCandidateNote,
  createCandidateApplication,
} from "./candidates/candidates-admin-service";

export {
  fetchHrBlogPosts,
  fetchHrBlogPostById,
  createHrBlogPost,
  updateHrBlogPost,
  deleteHrBlogPost,
} from "./blog/blog-admin-service";


