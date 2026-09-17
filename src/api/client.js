async function getJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export function getWords() {
  return getJson('/api/words');
}

export function getPhenomena() {
  return getJson('/api/phenomena');
}

export function getWordMap(word) {
  return getJson(`/api/words/${encodeURIComponent(word)}`);
}

export function getPhenomenonMap(key) {
  return getJson(`/api/phenomena/${encodeURIComponent(key)}`);
}
