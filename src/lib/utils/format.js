export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function severityColor(severity) {
  const map = {
    critical: 'bg-red-600 text-white',
    severe: 'bg-orange-500 text-white',
    moderate: 'bg-yellow-500 text-black',
    minor: 'bg-green-500 text-white'
  };
  return map[severity] || 'bg-gray-400 text-white';
}

export function severityLabel(severity) {
  const map = {
    critical: 'Critical',
    severe: 'Severe',
    moderate: 'Moderate',
    minor: 'Minor'
  };
  return map[severity] || severity;
}

export function statusBadge(status) {
  const map = {
    submitted: 'bg-blue-100 text-blue-800',
    verified: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

export function statusLabel(status) {
  const map = {
    submitted: 'Submitted',
    verified: 'Verified',
    in_progress: 'In Progress',
    resolved: 'Resolved'
  };
  return map[status] || status;
}

export function drainCategoryIcon(category) {
  const map = {
    roadside: '🛣️',
    residential: '🏠',
    market: '🏪',
    other: '📍'
  };
  return map[category] || '📍';
}
