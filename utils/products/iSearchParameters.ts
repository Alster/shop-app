import { AttributesEnum } from "@/app/constants";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

interface ISearchParameters extends IFindProductsQuery {
	[AttributesEnum.COLOR]?: string;
	[AttributesEnum.SIZE]?: string;
	[AttributesEnum.SIZE_SHOES]?: string;
}
export default ISearchParameters;
