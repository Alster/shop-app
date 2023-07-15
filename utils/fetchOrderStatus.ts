import { OrderStatus } from "@/shop-shared/constants/order";
import { fetchApi, ParseMethodEnum } from "@/utils/fetchApi";

export async function fetchOrderStatus(id: string, lang: string): Promise<OrderStatus> {
	return await fetchApi<OrderStatus>(
		`order/status/${id}`,
		{
			lang,
		},
		{ parseMethod: ParseMethodEnum.TEXT },
	);
}
