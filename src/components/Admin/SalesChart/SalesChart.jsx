import "./SalesChart.css";

import sales from "../../../data/sales";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function SalesChart() {
  return (
    <section className="sales-chart">

      <h2 className="sales-chart__title">
        Ventas de la semana
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={sales}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#5FA3A3"
            fill="#5FA3A3"
            fillOpacity={0.25}
          />

        </AreaChart>

      </ResponsiveContainer>

    </section>
  );
}