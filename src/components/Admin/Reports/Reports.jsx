import "./Reports.css";

import SalesChart from "../SalesChart/SalesChart";
import TopProducts from "../TopProducts/TopProducts";

export default function Reports() {

    return (

        <section className="reports">

            <h1>Reportes</h1>
             <SalesChart />

            <TopProducts />

        </section>

    );

}