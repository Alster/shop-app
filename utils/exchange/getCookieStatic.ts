import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function getCookieStatic(key: string): Promise<RequestCookie | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(key);
}
