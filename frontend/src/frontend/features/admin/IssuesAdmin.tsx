import React, { useState, useEffect } from 'react';
import { getIssuesFn, updateIssueStatusFn, deleteIssueFn } from '@/backend/features/issues';
import { Loader2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function IssuesAdmin() {
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const adminToken = sessionStorage.getItem("adminToken") || "";

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const data = await getIssuesFn({ data: { adminToken } });
      setIssues(data || []);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      await updateIssueStatusFn({ data: { adminToken, id, status: newStatus } });
      setIssues(issues.map(i => i._id === id ? { ...i, status: newStatus } : i));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    try {
      await deleteIssueFn({ data: { adminToken, id } });
      setIssues(issues.filter(i => i._id !== id));
    } catch (err) {
      console.error("Failed to delete issue", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Reported Issues</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="p-4">Date</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 w-1/3">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm text-slate-500 whitespace-nowrap">
                    {issue.createdAt ? format(new Date(issue.createdAt), 'dd MMM yyyy, h:mm a') : 'N/A'}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-900">{issue.name}</p>
                    <p className="text-xs text-slate-500">{issue.email}</p>
                    {issue.phone && <p className="text-xs text-slate-500">{issue.phone}</p>}
                  </td>
                  <td className="p-4 text-sm text-slate-600 capitalize">
                    {issue.type || 'website'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      issue.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.status === 'resolved' ? 'Resolved' : 'Open'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <p className="line-clamp-3" title={issue.description}>
                      {issue.description}
                    </p>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleUpdateStatus(issue._id, issue.status || 'open')}
                      className={`p-2 rounded-lg transition-colors ${
                        issue.status === 'resolved' 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={issue.status === 'resolved' ? 'Mark as Open' : 'Mark as Resolved'}
                    >
                      {issue.status === 'resolved' ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(issue._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No issues reported yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
