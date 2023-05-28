import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {ProductsListType} from "@/app/api/products/route";
import ProductsList from "@/app/products/productsList";

// export const getServerSideProps: GetServerSideProps<{
//     products: ProductsList;
// }> = async () => {
//     const res = await fetch("http://localhost:3000/api/products")
//     const products = await res.json();
//     return { props: { products } };
// };

// export async function getServerSideProps() {
//     // Fetch data from external API
//     const res = await fetch(`http://localhost:3000/api/products`);
//     const products = await res.json();
//
//     // Pass data to the page via props
//     return { props: { products } };
// }

export default async function Products() {
    const res = await fetch(`http://localhost:3000/api/products`);
    const data = await res.json();
    const products: ProductsListType = data.products;

    return <div>
        <ProductsList
            defaultList={products}
        ></ProductsList>
    </div>
}
