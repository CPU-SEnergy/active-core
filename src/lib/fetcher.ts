export default async function fetcher(url: string) {
  return fetch(`${url}?t=${Date.now()}`, {
    next: { revalidate: 0 },
  }).then((r) => r.json());
}
