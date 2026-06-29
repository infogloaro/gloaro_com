import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ChartCard({ title, data = [], type = 'line', dataKey = 'count', xKey = 'label' }) {
  const Chart = type === 'bar' ? BarChart : LineChart
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            {type === 'bar' ? <Bar dataKey={dataKey} fill="#1558b0" radius={[4, 4, 0, 0]} /> : <Line type="monotone" dataKey={dataKey} stroke="#1558b0" strokeWidth={3} />}
          </Chart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
