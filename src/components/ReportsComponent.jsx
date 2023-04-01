import { useState } from "react";
import PieChartComponent from "./PieChartComponent";
import SplineChartComponent from "./SplineChartComponent";

export default function ReportsComponent() {

    const [transactions, setTransactions] = useState([])

    return (
        <div className="container">
            <h1 className="h2 mb-5 text-royal-blue fw-bold">Reports</h1>
            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <tbody>
                        {
                            transactions.map(
                                transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.date.toString()}</td>
                                        <td>{transaction.destination.toString()}</td>
                                        <td>-{transaction.amount} {transaction.currency.toString()} RON</td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            {/* <PieChartComponent/> */}
            <SplineChartComponent/>
        </div>
    )
}