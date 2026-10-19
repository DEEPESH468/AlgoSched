export interface Job { id: string; name: string; deadline: number; profit: number }
export interface Slot { time: number; job: Job | null }
export interface Decision { job: Job; scheduled: boolean; slot: number | null; reason: string }
export interface OptimizationResult { slots: Slot[]; accepted: Job[]; rejected: Job[]; decisions: Decision[]; totalProfit: number; maxDeadline: number }

/** Greedy unit-time job sequencing. Stable tie-break: original input order. */
export function optimizeSchedule(jobs: readonly Job[]): OptimizationResult {
  for (const job of jobs) {
    if (!Number.isInteger(job.deadline) || job.deadline < 1) throw new Error(`Deadline for ${job.name} must be a positive integer.`);
    if (!Number.isInteger(job.profit) || job.profit < 0) throw new Error(`Profit for ${job.name} must be a nonnegative integer.`);
  }
  const maxDeadline = jobs.length ? Math.min(jobs.length, Math.max(...jobs.map(job => job.deadline))) : 0;
  const slots: Slot[] = Array.from({ length: maxDeadline }, (_, i) => ({ time: i + 1, job: null }));
  const ordered = jobs.map((job, index) => ({ job, index })).sort((a, b) => b.job.profit - a.job.profit || a.index - b.index);
  const decisions: Decision[] = [];
  for (const { job } of ordered) {
    let placed = false;
    for (let time = Math.min(job.deadline, maxDeadline); time >= 1; time--) {
      const slot = slots[time - 1];
      if (slot.job === null) {
        slot.job = job;
        decisions.push({ job, scheduled: true, slot: time, reason: `Scheduled in slot ${time}: the latest available slot on or before deadline ${job.deadline}.` });
        placed = true;
        break;
      }
    }
    if (!placed) decisions.push({ job, scheduled: false, slot: null, reason: `Rejected: no free slot exists on or before deadline ${job.deadline}.` });
  }
  const accepted = slots.flatMap(slot => slot.job ? [slot.job] : []);
  const rejected = decisions.filter(decision => !decision.scheduled).map(decision => decision.job);
  return { slots, accepted, rejected, decisions, totalProfit: accepted.reduce((sum, job) => sum + job.profit, 0), maxDeadline };
}
