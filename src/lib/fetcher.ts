export default async function fetcher(url: string) {
  return fetch(url, {
    next: { revalidate: 0 },
  }).then((r) => r.json());
}
