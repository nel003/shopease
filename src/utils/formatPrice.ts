

export default function formatPrice(n: number) {
    const f = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'PHP'
    });
    return f.format(n);
}