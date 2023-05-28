export interface Params_ProductId {
    id: string
}

export default function Products({ params }: { params: Params_ProductId }) {
    return <div>Product: {JSON.stringify(params, null, 2)}</div>
}
