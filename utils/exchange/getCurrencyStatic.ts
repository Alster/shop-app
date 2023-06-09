import {cookies} from "next/headers";

export function getCookieStatic(key: string) {
    const cookieStore = cookies()
    return cookieStore.get(key);
}
