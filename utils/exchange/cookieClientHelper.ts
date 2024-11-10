import { CookieValueTypes, getCookie as getC, setCookie as setC } from "cookies-next";

export async function setCookie(cname: string, cvalue: string, exdays: number): Promise<void> {
	await setC(cname, cvalue, { maxAge: exdays * 24 * 60 * 60 });
}

export async function getCookie(cname: string): Promise<CookieValueTypes> {
	return getC(cname);
}

export async function removeCookie(cname: string): Promise<void> {
	await setC(cname, "", { maxAge: 0 });
}
