import { OrderDto } from "@/shop-shared/dto/order/order.dto";
import { fetchApi } from "@/utils/fetchApi";

export async function fetchOrder(id: string, lang: string): Promise<OrderDto> {
	return await fetchApi<OrderDto>(`order/get/${id}`, {
		lang,
	});
}
