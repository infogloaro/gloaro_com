import EmptyState from '../../components/common/EmptyState'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Unit Reports</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Generate PDF summaries and activity ratios.</p>
        </div>
      </div>
      <EmptyState 
        title="Unit Reports Coming Soon" 
        description="The operational report selectors and graphic summaries are currently under development." 
      />
    </div>
  )
}
