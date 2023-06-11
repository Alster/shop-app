import {fetchApi, ParseMethod} from "@/utils/fetchApi";
import {OrderStatus} from "@/shop-shared/constants/order";

export async function fetchOrderStatus(id: string, lang: string): Promise<OrderStatus> {
    return await fetchApi<OrderStatus>(`order/status/${id}`, {
        lang,
    }, { parseMethod: ParseMethod.TEXT });
}
