import {fetchApi, ParseMethod} from "@/utils/fetchApi";

export async function fetchOrderCancel(id: string, lang: string): Promise<void> {
    await fetchApi<void>(`order/cancel/${id}`, {
        lang,
    }, {
        method: 'POST',
        parseMethod: ParseMethod.NONE,
    });
}
