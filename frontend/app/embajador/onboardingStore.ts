"use client";

import { useEffect, useSyncExternalStore } from "react";
import { onboardingBusinessData, type BusinessOnboarding, type OnboardingNote } from "./ambassadorData";

const STORAGE_KEY = "techmarket:embajador:onboarding:v2";

let onboardingState: BusinessOnboarding[] = cloneState(onboardingBusinessData);
const listeners = new Set<() => void>();
let hasHydrated = false;

function cloneNotes(notes: OnboardingNote[]): OnboardingNote[] {
  return notes.map((note) => ({ ...note }));
}

function cloneState(nextState: BusinessOnboarding[]): BusinessOnboarding[] {
  return nextState.map((item) => ({
    ...item,
    completedSteps: [...item.completedSteps],
    alerts: [...item.alerts],
    snapshot: { ...item.snapshot },
    validated: { ...item.validated },
    tracking: { ...item.tracking },
    metrics: { ...item.metrics },
    notes: cloneNotes(item.notes),
  }));
}

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return onboardingState;
}

function getServerSnapshot() {
  return onboardingState;
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

    return parsed as BusinessOnboarding[];
  } catch {
    return null;
  }
}

function writeStateToStorage(nextState: BusinessOnboarding[]) {
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

  onboardingState = cloneState(storedState);
  notify();
}

export function updateOnboardingState(nextState: BusinessOnboarding[]) {
  onboardingState = cloneState(nextState);
  writeStateToStorage(onboardingState);
  notify();
}

export function useOnboardingState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    hydrateFromStorage();
  }, []);

  return state;
}
