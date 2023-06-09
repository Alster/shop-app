import { setCookie as setC, getCookie as getC } from 'cookies-next';

export function setCookie(cname: string, cvalue: string, exdays: number) {
    setC(cname, cvalue, { maxAge: exdays * 24 * 60 * 60 });
}

export function getCookie(cname: string) {
    return getC(cname);
}
