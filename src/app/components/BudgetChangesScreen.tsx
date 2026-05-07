import { useState } from 'react';
import { ArrowLeft, Check, X, Plus } from 'lucide-react';

export interface BudgetChange {
  id: string;
  date: string;
  description: string;
  amount: number;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}

interface BudgetChangesScreenProps {
  clientName: string;
  changes: BudgetChange[];
  onBack: () => void;
  onApproveChange?: (changeId: string, notes: string) => void;
  onRejectChange?: (changeId: string, notes: string) => void;
  onAddChange?: (change: Omit<BudgetChange, 'id' | 'status'>) => void;
}

export default function BudgetChangesScreen({
  clientName,
  changes,
  onBack,
  onApproveChange,
  onRejectChange,
  onAddChange
}: BudgetChangesScreenProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChange, setNewChange] = useState({
    description: '',
    amount: 0,
    requestedBy: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [approvalNotes, setApprovalNotes] = useState<{ [key: string]: string }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddChange = () => {
    if (onAddChange && newChange.description && newChange.amount > 0 && newChange.requestedBy) {
      onAddChange(newChange);
      setNewChange({
        description: '',
        amount: 0,
        requestedBy: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
    }
  };

  const handleApprove = (changeId: string) => {
    if (onApproveChange) {
      onApproveChange(changeId, approvalNotes[changeId] || '');
      setApprovalNotes({ ...approvalNotes, [changeId]: '' });
    }
  };

  const handleReject = (changeId: string) => {
    if (onRejectChange) {
      onRejectChange(changeId, approvalNotes[changeId] || '');
      setApprovalNotes({ ...approvalNotes, [changeId]: '' });
    }
  };

  const pendingChanges = changes.filter(c => c.status === 'pending');
  const approvedChanges = changes.filter(c => c.status === 'approved');
  const rejectedChanges = changes.filter(c => c.status === 'rejected');

  const totalPendingAmount = pendingChanges.reduce((sum, c) => sum + c.amount, 0);
  const totalApprovedAmount = approvedChanges.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-4 border-black p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-black">
            <button
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
            >
              <ArrowLeft size={24} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-8">
              <div className="border-2 border-black p-4">
                <h1 className="text-xl">SPIRAL LOGO</h1>
              </div>
              <div className="text-right">
                <p className="text-lg">{clientName}</p>
                <p className="text-sm text-gray-600">Budget Changes and Approvals</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border-2 border-black p-4 bg-yellow-50">
              <p className="text-sm mb-2">Pending Approval</p>
              <p className="text-2xl">{formatCurrency(totalPendingAmount)}</p>
              <p className="text-sm text-gray-600 mt-1">{pendingChanges.length} requests</p>
            </div>
            <div className="border-2 border-black p-4 bg-green-50">
              <p className="text-sm mb-2">Approved Changes</p>
              <p className="text-2xl">{formatCurrency(totalApprovedAmount)}</p>
              <p className="text-sm text-gray-600 mt-1">{approvedChanges.length} approved</p>
            </div>
            <div className="border-2 border-black p-4 bg-red-50">
              <p className="text-sm mb-2">Rejected</p>
              <p className="text-2xl">{rejectedChanges.length}</p>
              <p className="text-sm text-gray-600 mt-1">requests</p>
            </div>
          </div>

          {/* Add Change Button */}
          {onAddChange && (
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
                Request Budget Change
              </button>
            </div>
          )}

          {/* Add Change Form */}
          {showAddForm && (
            <div className="border-2 border-black p-6 mb-8 bg-gray-50">
              <h3 className="text-lg mb-4">New Budget Change Request</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Date</label>
                  <input
                    type="date"
                    value={newChange.date}
                    onChange={(e) => setNewChange({ ...newChange, date: e.target.value })}
                    className="w-full border-2 border-black p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Description</label>
                  <textarea
                    value={newChange.description}
                    onChange={(e) => setNewChange({ ...newChange, description: e.target.value })}
                    className="w-full border-2 border-black p-2 min-h-[100px]"
                    placeholder="Describe the budget change..."
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Amount (COP)</label>
                  <input
                    type="number"
                    value={newChange.amount || ''}
                    onChange={(e) => setNewChange({ ...newChange, amount: Number(e.target.value) })}
                    className="w-full border-2 border-black p-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Requested By</label>
                  <input
                    type="text"
                    value={newChange.requestedBy}
                    onChange={(e) => setNewChange({ ...newChange, requestedBy: e.target.value })}
                    className="w-full border-2 border-black p-2"
                    placeholder="Name"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddChange}
                    className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="border-2 border-black px-6 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Changes */}
          {pendingChanges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl mb-4 pb-2 border-b-2 border-black">Pending Approval</h2>
              <div className="space-y-4">
                {pendingChanges.map((change) => (
                  <div key={change.id} className="border-2 border-black p-6 bg-yellow-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">{change.date}</p>
                        <p className="text-lg mb-2">{change.description}</p>
                        <p className="text-2xl text-red-600 mb-2">{formatCurrency(change.amount)}</p>
                        <p className="text-sm">Requested by: {change.requestedBy}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <textarea
                        value={approvalNotes[change.id] || ''}
                        onChange={(e) => setApprovalNotes({ ...approvalNotes, [change.id]: e.target.value })}
                        placeholder="Add approval notes (optional)..."
                        className="w-full border-2 border-black p-2 min-h-[80px]"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(change.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-colors"
                        >
                          <Check size={20} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(change.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors"
                        >
                          <X size={20} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Changes */}
          {approvedChanges.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl mb-4 pb-2 border-b-2 border-black">Approved Changes</h2>
              <div className="space-y-4">
                {approvedChanges.map((change) => (
                  <div key={change.id} className="border-2 border-black p-6 bg-green-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">{change.date}</p>
                        <p className="text-lg mb-2">{change.description}</p>
                        <p className="text-2xl text-red-600 mb-2">{formatCurrency(change.amount)}</p>
                        <p className="text-sm">Requested by: {change.requestedBy}</p>
                        {change.approvedBy && (
                          <p className="text-sm text-green-700 mt-2">
                            Approved by {change.approvedBy} on {change.approvalDate}
                          </p>
                        )}
                        {change.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">Note: {change.notes}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 text-sm">
                          <Check size={16} />
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Changes */}
          {rejectedChanges.length > 0 && (
            <div>
              <h2 className="text-xl mb-4 pb-2 border-b-2 border-black">Rejected Changes</h2>
              <div className="space-y-4">
                {rejectedChanges.map((change) => (
                  <div key={change.id} className="border-2 border-black p-6 bg-red-50 opacity-75">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">{change.date}</p>
                        <p className="text-lg mb-2">{change.description}</p>
                        <p className="text-2xl text-red-600 mb-2">{formatCurrency(change.amount)}</p>
                        <p className="text-sm">Requested by: {change.requestedBy}</p>
                        {change.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">Rejection reason: {change.notes}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 text-sm">
                          <X size={16} />
                          Rejected
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {changes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No budget change requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
