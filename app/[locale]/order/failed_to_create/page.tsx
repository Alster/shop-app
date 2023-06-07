export default async function FailedToCreateOrderPage({ searchParams }: any) {
    return <div>
        <h1>Failed to create order</h1>
        <p>Reason: {searchParams.reason}</p>
    </div>
}
