import {use, useEffect, useMemo, useState, useTransition} from "react";
import {type Column, GenericTable} from "../../components/GenericTable.tsx";
import useModal from "../../components/modals/useModal.tsx";
import useToast from "../../components/toasts/useToast.tsx";
import {formatDate} from "../../utils";
import LoggedUserContext from "../../contexts/LoggedUserContext";
import type {OrderType} from "../../model/OrderTypes.ts";
import {orderApi} from "../../api/OrderRestApi.ts";

export default function ListOrders() {
    const [orders, setOrders] = useState<OrderType[]>([])
    const [isPending, startTransition] = useTransition()
    const {showConfirmation} = useModal()
    const {addToast} = useToast()

    const {user} = use(LoggedUserContext);

    const columns: Column<OrderType>[] = useMemo(() => [
        {
            header: 'Date',
            render: (o) => `${formatDate(o.date)}`
        },
        {
            header: 'Email',
            render: (o) => <span className="text-secondary">#{o.email}</span>
        },
        {
            header: 'Phone Number',
            render: (o) => o.phoneNumber
        },
        {
            header: 'Current State',
            render: (o) => <span className="text-warning">{o.state.name}</span>
        },
        {
            header: 'Client\'s Username',
            render: (o) => <span className="fw-bold">{o.username}</span>
        },
        {
            header: 'Selected Products',
            render: (o) => o.productList.map((p) => p.name)
        }
    ], []);

    const loadOrders = () => {
        startTransition(() => {
            orderApi.getAll().then((response) => {
                setOrders(response.data)
            })
        })
    }

    useEffect(() => {
        loadOrders()
    }, [addToast])

    return (
        <div className="container">
            <h2>Order List</h2>
            {isPending ? <p>Fetching data...</p> : <GenericTable data={orders} columns={columns}/>}
        </div>
    );
}