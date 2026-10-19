# AlgoSched

AlgoSched is an interactive job scheduling and optimization workspace built for a Design and Analysis of Algorithms lab project. Add jobs with deadlines and profits, run the greedy scheduler, and inspect the resulting time slots and each scheduling decision.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build or run the algorithm tests:

```bash
npm run build
npm test
```

## Using the scheduler

1. Start with the sample dataset or add your own jobs.
2. Set each job's name, deadline, and nonnegative profit.
3. Choose **Optimize schedule** to calculate a schedule.
4. Review maximum profit, scheduled and rejected jobs, slot utilization, the timeline, and the decision explanations.

Jobs can be sorted, edited, deleted, and re-optimized after the dataset changes. The workspace runs locally and does not require an account, API key, backend, or database.

## Algorithm

The scheduler implements greedy job sequencing with deadlines under these assumptions:

- Every job takes exactly one unit of time.
- Only one job can occupy a time slot.
- A job earns its profit only when completed by its deadline.
- Jobs have nonnegative integer profits and positive integer deadlines.

The implementation sorts jobs by descending profit, preserving input order when profits tie. For each job, it scans backward from the earlier of the job's deadline and the maximum useful deadline, assigning the job to the latest free slot. It rejects the job if no eligible slot is available. The original jobs array is not mutated.

For `n` jobs and maximum useful deadline `D`, the slot-scanning implementation takes **O(n log n + nD)** time and **O(D)** auxiliary space for the slot array, excluding sorting and returned results.

This classic greedy method applies to the unit-time, independent-job model above; it is not a general solution for jobs with arbitrary durations or dependencies.

## Project views

- **Overview** — a quick guide to the scheduling workflow.
- **Job Scheduler** — manage jobs and inspect optimized schedules.
- **Algorithm Explorer** — strategy, pseudocode, worked example, assumptions, and complexity.
- **About the Project** — project purpose and core concepts.

## Stack

React, TypeScript, Vite, and Lucide icons. The algorithm is kept separate from the interface in `src/algorithm.ts` and covered by unit tests in `src/algorithm.test.ts`.
