"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastContainer, { useToast } from "@/components/ToastContainer";
import { apiClient } from "@/lib/utils/api-client";
import type { Issue } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { showToast, removeToast, toasts } = useToast();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [formData, setFormData] = useState({
    type: "CLOUD_SECURITY" as "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT",
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    status: "OPEN" as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  });
  const [editFormData, setEditFormData] = useState({
    type: "CLOUD_SECURITY" as "CLOUD_SECURITY" | "RETEAM_ASSESSMENT" | "VAPT",
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    status: "OPEN" as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  });

  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/auth/me");
      if (response.success) {
        setUser(response.data);
      } else {
        router.push("/login");
      }
    } catch (error) {
      router.push("/login");
    }
  }, [router]);

  const loadIssues = useCallback(async () => {
    try {
      const url = filterType
        ? `/api/issues?type=${filterType}`
        : "/api/issues";
      const response = await apiClient.get<Issue[]>(url);
      if (response.success && response.data) {
        setIssues(response.data);
      }
    } catch (error) {
      console.error("Failed to load issues:", error);
      showToast("Failed to load issues", "error");
    } finally {
      setLoading(false);
    }
  }, [filterType, showToast]);

  useEffect(() => {
    loadUser();
    loadIssues();
  }, [loadUser, loadIssues]);

  useEffect(() => {
    loadIssues();
  }, [filterType, loadIssues]);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiClient.post("/api/issues", formData);
      if (response.success) {
        setShowForm(false);
        setFormData({
          type: "CLOUD_SECURITY",
          title: "",
          description: "",
          priority: "MEDIUM",
          status: "OPEN",
        });
        showToast("Issue created successfully!", "success");
        loadIssues();
      } else {
        showToast(response.error || "Failed to create issue", "error");
      }
    } catch (error: any) {
      showToast(error.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssueId(issue.id);
    setEditFormData({
      type: issue.type,
      title: issue.title,
      description: issue.description,
      priority: (issue.priority || "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      status: (issue.status || "OPEN") as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
    });
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingIssueId(null);
    setEditFormData({
      type: "CLOUD_SECURITY",
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "OPEN",
    });
  };

  const handleUpdateIssue = async (e: React.FormEvent, issueId: string) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiClient.put(`/api/issues/${issueId}`, editFormData);
      if (response.success) {
        setEditingIssueId(null);
        setEditFormData({
          type: "CLOUD_SECURITY",
          title: "",
          description: "",
          priority: "MEDIUM",
          status: "OPEN",
        });
        showToast("Issue updated successfully!", "success");
        loadIssues();
      } else {
        showToast(response.error || "Failed to update issue", "error");
      }
    } catch (error: any) {
      showToast(error.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;

    try {
      const response = await apiClient.delete(`/api/issues/${id}`);
      if (response.success) {
        showToast("Issue deleted successfully!", "success");
        loadIssues();
      } else {
        showToast(response.error || "Failed to delete issue", "error");
      }
    } catch (error: any) {
      showToast(error.message || "An error occurred", "error");
    }
  };

  const getIssueTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-900/30 text-red-400 border-red-800";
      case "HIGH":
        return "bg-orange-900/30 text-orange-400 border-orange-800";
      case "MEDIUM":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800";
      case "LOW":
        return "bg-green-900/30 text-green-400 border-green-800";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-900/30 text-blue-400 border-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-900/30 text-purple-400 border-purple-800";
      case "RESOLVED":
        return "bg-green-900/30 text-green-400 border-green-800";
      case "CLOSED":
        return "bg-slate-800 text-slate-400 border-slate-700";
      default:
        return "bg-blue-900/30 text-blue-400 border-blue-800";
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "CLOUD_SECURITY":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case "RETEAM_ASSESSMENT":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case "VAPT":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-900 border-t-primary-500 mx-auto"></div>
            <p className="mt-6 text-slate-300 text-lg font-medium">Loading your dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Welcome{user?.name ? `, ${user.name}` : ""}!
                </h1>
                <p className="text-slate-300 mt-1">
                  Manage your security issues and assessments
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border-l-4 border-primary-500 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Issues</p>
                  <p className="text-3xl font-bold text-white mt-1">{issues.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Open Issues</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {issues.filter((i) => i.status === "OPEN").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 border-l-4 border-green-500 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Resolved</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {issues.filter((i) => i.status === "RESOLVED" || i.status === "CLOSED").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Section */}
          <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm border border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Issues</h2>
                <p className="text-slate-400 text-sm mt-1">Create and manage your security issues</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingIssueId(null);
                }}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {showForm ? "Cancel" : "Create New Issue"}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleCreateIssue}
                className="mb-6 p-6 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Issue Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200"
                      required
                    >
                      <option value="CLOUD_SECURITY">Cloud Security</option>
                      <option value="RETEAM_ASSESSMENT">Red Team Assessment</option>
                      <option value="VAPT">VAPT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200 placeholder-slate-500"
                    required
                    placeholder="Enter issue title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-slate-200 placeholder-slate-500"
                    rows={4}
                    required
                    placeholder="Describe the issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Create Issue
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all max-w-xs text-slate-200"
              >
                <option value="">All Types</option>
                <option value="CLOUD_SECURITY">Cloud Security</option>
                <option value="RETEAM_ASSESSMENT">Red Team Assessment</option>
                <option value="VAPT">VAPT</option>
              </select>
            </div>

            {/* Issues List */}
            {issues.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg font-medium">No issues found</p>
                <p className="text-slate-500 text-sm mt-1">Create your first issue to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${
                      editingIssueId === issue.id
                        ? "border-primary-500 bg-primary-900/20"
                        : "border-slate-700 bg-slate-800/50 hover:border-primary-600"
                    }`}
                  >
                    {editingIssueId === issue.id ? (
                      // Edit Form
                      <form
                        onSubmit={(e) => handleUpdateIssue(e, issue.id)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Issue Type
                            </label>
                            <select
                              value={editFormData.type}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  type: e.target.value as any,
                                })
                              }
                              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200"
                              required
                            >
                              <option value="CLOUD_SECURITY">Cloud Security</option>
                              <option value="RETEAM_ASSESSMENT">Red Team Assessment</option>
                              <option value="VAPT">VAPT</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Priority
                            </label>
                            <select
                              value={editFormData.priority}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  priority: e.target.value as any,
                                })
                              }
                              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200"
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                              <option value="CRITICAL">Critical</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                              Status
                            </label>
                            <select
                              value={editFormData.status}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  status: e.target.value as any,
                                })
                              }
                              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editFormData.title}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, title: e.target.value })
                            }
                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-200 placeholder-slate-500"
                            required
                            placeholder="Issue title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            value={editFormData.description}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-slate-200 placeholder-slate-500"
                            rows={4}
                            required
                            placeholder="Describe the issue..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 bg-slate-700 text-slate-200 px-6 py-2.5 rounded-lg hover:bg-slate-600 transition-all duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      // Issue Display
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-2 text-primary-400 font-semibold">
                              {getIssueTypeIcon(issue.type)}
                              <span>{getIssueTypeLabel(issue.type)}</span>
                            </div>
                            <span
                              className={`text-xs px-3 py-1 rounded-full border font-medium ${getPriorityColor(
                                issue.priority
                              )}`}
                            >
                              {issue.priority || "MEDIUM"}
                            </span>
                            <span
                              className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                                issue.status
                              )}`}
                            >
                              {issue.status || "OPEN"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {issue.title}
                          </h3>
                          <p className="text-slate-300 mb-3 leading-relaxed">{issue.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Created: {new Date(issue.createdAt).toLocaleDateString()}
                            </span>
                            {issue.updatedAt !== issue.createdAt && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Updated: {new Date(issue.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col sm:items-end">
                          <button
                            onClick={() => handleEditIssue(issue)}
                            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-900/20 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-900/20 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
