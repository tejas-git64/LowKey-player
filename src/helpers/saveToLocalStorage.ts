export function saveToLocalStorage(
  storageKey: string,
  updates: Record<string, unknown>,
) {
  try {
    const prev = JSON.parse(localStorage.getItem(storageKey) || "{}");
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...prev,
        ...updates,
      }),
    );
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(updates));
  }
}
