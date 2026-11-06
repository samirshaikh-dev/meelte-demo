

### . Script to Empty Firebase Data

We have created [`scripts/empty-hr-firebase.mjs`](file:///s:/Office/Meelte-Bengalore/nextjs-website/scripts/empty-hr-firebase.mjs) to clean out Firestore and Storage data safely.

#### What It Cleans:
- **Cloud Firestore**: Deletes all documents in **`hr_jobs`** and **`hr_candidates`** using batched operations (chunks of up to 450 documents).
- **Firebase Storage**: Recursively traverses and deletes all uploaded files under **`hr/resumes`**.

#### How to Run It:

1. **Interactive Mode (with confirmation prompt)**:
   ```bash
   npm run firebase:empty
   # or
   node scripts/empty-hr-firebase.mjs
   ```
   *Prompts for explicit `yes` confirmation before executing any deletion.*

2. **Automated / Force Mode (bypasses prompt)**:
   ```bash
   node scripts/empty-hr-firebase.mjs --force
   # or
   node scripts/empty-hr-firebase.mjs --yes
   ```

3. **To re-seed fresh mock data afterwards**:
   ```bash
   npm run firebase:seed
   # or
   node scripts/seed-hr-firebase.mjs
   ```

---

### 3. Verification
- **Safety check**: Executing `node scripts/empty-hr-firebase.mjs` in non-interactive environments cleanly aborts unless `--force` or `--yes` is passed.
- **ESLint**: `npm run lint` passed with **0 errors**.
- **Codebase Graph**: Synchronized via `python -m code_review_graph update`.