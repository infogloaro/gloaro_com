import EmptyState from '../../components/common/EmptyState'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Documents Vault</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Upload and search files and presentations.</p>
        </div>
      </div>
      <EmptyState 
        title="Documents Vault Coming Soon" 
        description="The document upload portal and tag filtering searches are currently under development." 
      />
    </div>
  )
}
