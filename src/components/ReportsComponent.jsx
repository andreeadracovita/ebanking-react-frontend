import { useState } from "react";
import PieChartComponent from "./PieChartComponent";
import SplineChartComponent from "./SplineChartComponent";

export default function ReportsComponent() {

    const [transactions, setTransactions] = useState([])

    return (
        <div className="container">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                <h1 class="h1">Reports</h1>
                <div class="btn-toolbar mb-2 mb-md-0">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        This week
                    </button>
                </div>
            </div>
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
            <PieChartComponent/>
            <SplineChartComponent/>
        </div>
    )
}