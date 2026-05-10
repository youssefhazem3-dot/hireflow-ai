import type { CandidateRecord, CandidateStatus } from "@/lib/types";

const localCandidateKey = "hireflow-demo-candidates";
const localCandidateEvent = "hireflow-local-candidates";
const emptyLocalCandidates: CandidateRecord[] = [];

let candidateCacheRaw: string | null = null;
let candidateCache: CandidateRecord[] = emptyLocalCandidates;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readLocalCandidates() {
  if (!canUseStorage()) {
    return emptyLocalCandidates;
  }

  try {
    const rawValue = window.localStorage.getItem(localCandidateKey);
    return rawValue ? (JSON.parse(rawValue) as CandidateRecord[]) : [];
  } catch {
    return emptyLocalCandidates;
  }
}

export function getLocalCandidatesSnapshot() {
  if (!canUseStorage()) {
    return emptyLocalCandidates;
  }

  const rawValue = window.localStorage.getItem(localCandidateKey) ?? "[]";

  if (rawValue !== candidateCacheRaw) {
    candidateCacheRaw = rawValue;
    candidateCache = readLocalCandidates();
  }

  return candidateCache;
}

export function getServerLocalCandidatesSnapshot() {
  return emptyLocalCandidates;
}

export function subscribeLocalCandidates(onStoreChange: () => void) {
  if (!canUseStorage()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(localCandidateEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(localCandidateEvent, onStoreChange);
  };
}

function notifyLocalCandidateChange() {
  if (canUseStorage()) {
    window.dispatchEvent(new Event(localCandidateEvent));
  }
}

export function saveLocalCandidate(record: CandidateRecord) {
  if (!canUseStorage()) {
    return;
  }

  const records = readLocalCandidates().filter((item) => item.id !== record.id);
  window.localStorage.setItem(
    localCandidateKey,
    JSON.stringify([record, ...records].slice(0, 25)),
  );
  notifyLocalCandidateChange();
}

export function clearLocalCandidates() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(localCandidateKey);
  candidateCacheRaw = null;
  candidateCache = emptyLocalCandidates;
  notifyLocalCandidateChange();
}

export function deleteLocalCandidate(candidateId: number) {
  if (!canUseStorage()) {
    return;
  }

  const records = readLocalCandidates().filter(
    (record) => record.id !== candidateId,
  );
  window.localStorage.setItem(localCandidateKey, JSON.stringify(records));
  candidateCacheRaw = null;
  notifyLocalCandidateChange();
}

export function updateLocalCandidateStatus(
  candidateId: number,
  status: CandidateStatus,
) {
  if (!canUseStorage()) {
    return;
  }

  const records = readLocalCandidates().map((record) =>
    record.id === candidateId
      ? {
          ...record,
          status,
          logs: [
            {
              id: Date.now(),
              candidate_id: candidateId,
              action: "Status Updated",
              details: `Candidate status changed to ${status}.`,
              created_at: new Date().toISOString(),
            },
            ...record.logs,
          ],
        }
      : record,
  );

  window.localStorage.setItem(localCandidateKey, JSON.stringify(records));
  notifyLocalCandidateChange();
}
