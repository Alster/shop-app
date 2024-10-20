import { CookieValueTypes, getCookie as getC, setCookie as setC } from "cookies-next";

export function setCookie(cname: string, cvalue: string, exdays: number): void {
	setC(cname, cvalue, { maxAge: exdays * 24 * 60 * 60 });
}

export function getCookie(cname: string): CookieValueTypes {
	return getC(cname);
}

export function removeCookie(cname: string): void {
	setC(cname, "", { maxAge: 0 });
}
