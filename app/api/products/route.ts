import { NextResponse } from 'next/server';

export type ProductsListType = {
    id: string;
    title: string;
    price: number;
    description: string;
    image: string;
}[];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    // const id = searchParams.get('id');
    // const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'API-Key': process.env.DATA_API_KEY,
    //     },
    // });

    const products = await getProductsList();

    return NextResponse.json({ products });
}

export async function getProductsList(): Promise<ProductsListType> {
    const products: ProductsListType = [
        {
            id: "1",
            title: "Product 1",
            price: 100,
            description: "This is product 1",
            image: "https://picsum.photos/200/300"
        },
        {
            id: "2",
            title: "Product 2",
            price: 200,
            description: "This is product 2",
            image: "https://picsum.photos/200/300"
        },
        {
            id: "3",
            title: "Product 3",
            price: 300,
            description: "This is product 3",
            image: "https://picsum.photos/200/300"
        }
    ];
    return products;
}
