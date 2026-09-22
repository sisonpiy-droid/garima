import { prisma } from "@/lib/prisma";
import { createJournalEntry, deleteJournalEntry, toggleJournalVisibility } from "@/lib/actions/journal";
import { VisibilityToggle } from "@/components/VisibilityToggle";
import { formatDate } from "@/lib/utils";

export default async function JournalPage() {
  const entries = await prisma.journalEntry.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Journal</h1>
        <p className="text-sm text-muted">Private by default. Publish an entry only if you choose to.</p>
      </div>

      <form action={createJournalEntry} className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <textarea name="didToday" placeholder="What did I do today?" rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea name="workingOn" placeholder="What am I working on?" rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea name="learned" placeholder="What did I learn?" rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          <textarea name="tomorrow" placeholder="What should I do tomorrow?" rows={2} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <select name="visibility" defaultValue="PRIVATE" className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
          <button type="submit" className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white">Save entry</button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {entries.length === 0 && <p className="text-sm text-muted">No entries yet.</p>}
        {entries.map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-muted">{formatDate(e.date)}</p>
              <div className="flex items-center gap-2">
                <VisibilityToggle visibility={e.visibility} onToggle={toggleJournalVisibility.bind(null, e.id)} />
                <form action={deleteJournalEntry.bind(null, e.id)}>
                  <button type="submit" className="text-xs text-muted hover:text-red-600">Delete</button>
                </form>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {e.didToday && <p><span className="text-muted">Did: </span>{e.didToday}</p>}
              {e.workingOn && <p><span className="text-muted">Working on: </span>{e.workingOn}</p>}
              {e.learned && <p><span className="text-muted">Learned: </span>{e.learned}</p>}
              {e.tomorrow && <p><span className="text-muted">Tomorrow: </span>{e.tomorrow}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
