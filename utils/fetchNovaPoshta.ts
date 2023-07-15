export async function fetchNovaPoshta<T>(query: any): Promise<T> {
	const response = await fetch(`https://api.novaposhta.ua/v2.0/json/`, {
		next: { revalidate: +(process.env.NEXT_PUBLIC_FETCH_REVALIDATE_SEC || "") },
		method: "POST",
		body: JSON.stringify({
			apiKey: process.env.NEXT_PUBLIC_NOVA_POSHTA_API_KEY,
			...query,
		}),
	});
	return await response.json();
}
