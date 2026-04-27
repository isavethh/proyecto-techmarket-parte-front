"use client";

import { useEffect, useSyncExternalStore } from "react";
import { referredBusinesses, type ReferredBusiness } from "./ambassadorData";

const STORAGE_KEY = "techmarket:embajador:referred-businesses:v1";

let businessState: ReferredBusiness[] = cloneBusinessState(referredBusinesses);
const listeners = new Set<() => void>();
let hasHydrated = false;

function cloneBusinessState(nextState: ReferredBusiness[]): ReferredBusiness[] {
  return nextState.map((business) => ({
    ...business,
    strengths: [...business.strengths],
    risks: [...business.risks],
  }));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return businessState;
}

function getServerSnapshot() {
  return businessState;
}

function readStateFromStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed as ReferredBusiness[];
  } catch {
    return null;
  }
}

function writeStateToStorage(nextState: ReferredBusiness[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Ignore storage errors to keep the UI responsive.
  }
}

function hydrateFromStorage() {
  if (hasHydrated || typeof window === "undefined") {
    return;
  }

  hasHydrated = true;
  const storedState = readStateFromStorage();
  if (!storedState) {
    return;
  }

  businessState = cloneBusinessState(storedState);
  notify();
}

export function updateReferredBusinessesState(nextState: ReferredBusiness[]) {
  businessState = cloneBusinessState(nextState);
  writeStateToStorage(businessState);
  notify();
}

export function useReferredBusinessesState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  return state;
}
