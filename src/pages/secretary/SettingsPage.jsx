import EmptyState from '../../components/common/EmptyState'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Profile Settings</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">Manage credentials and profile configurations.</p>
        </div>
      </div>
      <EmptyState 
        title="Profile Settings Coming Soon" 
        description="Profile preferences and credentials updating panels are currently under development." 
      />
    </div>
  )
}
