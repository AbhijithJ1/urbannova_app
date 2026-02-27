"use client";

import { useState } from "react";
import { createWard, updateWard, deleteWard } from "@/actions/ward.actions";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Props {
  mode: "create" | "edit" | "delete";
  wardId?: string;
  wardName?: string;
  hasCitizens?: boolean;
}

export default function WardActions({ mode, wardId, wardName, hasCitizens }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(wardName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await createWard(name);
      setName("");
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit() {
    if (!name.trim() || !wardId) return;
    setLoading(true);
    setError("");
    try {
      await updateWard(wardId, name);
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!wardId) return;
    setLoading(true);
    setError("");
    try {
      await deleteWard(wardId);
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "create") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Ward
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Ward</h3>
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                placeholder="Ward name"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors">
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />} Create
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (mode === "edit") {
    return (
      <>
        <button onClick={() => { setName(wardName || ""); setOpen(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {open && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Rename Ward</h3>
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button onClick={handleEdit} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors">
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />} Save
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Delete mode
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={hasCitizens}
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        title={hasCitizens ? "Cannot delete ward with citizens" : "Delete ward"}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Ward</h3>
            <p className="text-sm text-slate-500 mb-4">
              Are you sure you want to delete <strong>{wardName}</strong>? This cannot be undone.
            </p>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors">
                {loading && <Loader2 className="w-3 h-3 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
