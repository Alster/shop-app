import {fetchApi} from "@/utils/fetchApi";
import {OrderDto} from "@/shop-shared/dto/order/order.dto";

export async function fetchOrder(id: string, lang: string): Promise<OrderDto> {
    return await fetchApi<OrderDto>(`order/get/${id}`, {
        lang,
    });
}
