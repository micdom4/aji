import { Link } from "react-router-dom"

const CartPage = () => {
    return <>
        <p>Twój koszyk jest na razie pusty. Przejdź na stronę <Link to={'/products'}>Produkty</Link> i dodaj jakieś do koszyka.</p>
    </>
}

export default CartPage;