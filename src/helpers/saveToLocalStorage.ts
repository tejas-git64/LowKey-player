export function saveToLocalStorage(
  storageKey: string,
  updates: Record<string, any>,
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
  } catch (e) {
    localStorage.setItem(storageKey, JSON.stringify(updates));
  }
}
