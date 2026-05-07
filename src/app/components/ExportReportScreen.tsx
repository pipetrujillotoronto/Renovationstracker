import { ArrowLeft, FileDown, FileJson, Printer } from 'lucide-react';
import { exportToCSV, exportToJSON, generatePDFReport } from '../utils/exportUtils';
import { BudgetChange } from './BudgetChangesScreen';

interface ProjectMilestone {
  id: string;
  date: string;
  photo?: string;
  progress: string;
  spent: number;
  invoices: { id: string; name: string; amount: number }[];
  changes: { id: string; description: string; amount: number }[];
  comments: string;
}

interface ExportReportScreenProps {
  clientName: string;
  totalBudget: number;
  spentBudget: number;
  budgetIncrease: number;
  milestones: ProjectMilestone[];
  budgetChanges: BudgetChange[];
  onBack: () => void;
}

export default function ExportReportScreen({
  clientName,
  totalBudget,
  spentBudget,
  budgetIncrease,
  milestones,
  budgetChanges,
  onBack
}: ExportReportScreenProps) {
  const projectData = {
    clientName,
    totalBudget,
    spentBudget,
    budgetIncrease,
    milestones,
    budgetChanges
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleExportCSV = () => {
    exportToCSV(projectData);
  };

  const handleExportJSON = () => {
    exportToJSON(projectData);
  };

  const handleGeneratePDF = () => {
    generatePDFReport(projectData);
  };

  const totalInvoices = milestones.reduce((sum, m) =>
    sum + m.invoices.reduce((s, inv) => s + inv.amount, 0), 0
  );

  const approvedChanges = budgetChanges.filter(c => c.status === 'approved');
  const totalApprovedChanges = approvedChanges.reduce((sum, c) => sum + c.amount, 0);

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
                <p className="text-sm text-gray-600">Export & Reports</p>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="mb-8">
            <h2 className="text-2xl mb-6 pb-2 border-b-2 border-black">Project Summary</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-2 border-black p-6">
                <h3 className="text-lg mb-4">Budget Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Budget:</span>
                    <span className="font-bold">{formatCurrency(totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent to Date:</span>
                    <span className="font-bold">{formatCurrency(spentBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Increase:</span>
                    <span className="font-bold text-red-600">{formatCurrency(budgetIncrease)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-black">
                    <span>Remaining:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(totalBudget + budgetIncrease - spentBudget)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-black p-6">
                <h3 className="text-lg mb-4">Project Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Milestones:</span>
                    <span className="font-bold">{milestones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Invoices:</span>
                    <span className="font-bold">{formatCurrency(totalInvoices)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Changes:</span>
                    <span className="font-bold">{approvedChanges.length}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-black">
                    <span>Total Change Amount:</span>
                    <span className="font-bold text-red-600">{formatCurrency(totalApprovedChanges)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-8">
            <h2 className="text-2xl mb-6 pb-2 border-b-2 border-black">Export Options</h2>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={handleExportCSV}
                className="border-2 border-black p-8 hover:bg-gray-100 transition-colors flex flex-col items-center gap-4"
              >
                <FileDown size={48} />
                <div className="text-center">
                  <p className="text-lg mb-2">Export to CSV</p>
                  <p className="text-sm text-gray-600">Download project data as spreadsheet</p>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="border-2 border-black p-8 hover:bg-gray-100 transition-colors flex flex-col items-center gap-4"
              >
                <FileJson size={48} />
                <div className="text-center">
                  <p className="text-lg mb-2">Export to JSON</p>
                  <p className="text-sm text-gray-600">Download raw data for integration</p>
                </div>
              </button>

              <button
                onClick={handleGeneratePDF}
                className="border-2 border-black p-8 hover:bg-gray-100 transition-colors flex flex-col items-center gap-4"
              >
                <Printer size={48} />
                <div className="text-center">
                  <p className="text-lg mb-2">Print Report</p>
                  <p className="text-sm text-gray-600">Generate printable PDF report</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div>
            <h2 className="text-2xl mb-6 pb-2 border-b-2 border-black">Recent Activity</h2>
            <div className="space-y-4">
              {milestones.slice(-3).reverse().map(milestone => (
                <div key={milestone.id} className="border-2 border-black p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold mb-1">{milestone.date}</p>
                      <p className="text-sm text-gray-600">{milestone.progress}</p>
                    </div>
                    <p className="text-lg">{formatCurrency(milestone.spent)}</p>
                  </div>
                </div>
              ))}
              {milestones.length === 0 && (
                <p className="text-gray-500 text-center py-8">No activity recorded yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
