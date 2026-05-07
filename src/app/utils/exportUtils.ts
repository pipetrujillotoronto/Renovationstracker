import { BudgetChange } from '../components/BudgetChangesScreen';

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

interface ProjectData {
  clientName: string;
  totalBudget: number;
  spentBudget: number;
  budgetIncrease: number;
  milestones: ProjectMilestone[];
  budgetChanges: BudgetChange[];
}

export const exportToCSV = (data: ProjectData) => {
  const rows: string[] = [];

  // Header
  rows.push('Project Summary Report');
  rows.push(`Client Name,${data.clientName}`);
  rows.push(`Total Budget,${data.totalBudget}`);
  rows.push(`Spent Budget,${data.spentBudget}`);
  rows.push(`Budget Increase,${data.budgetIncrease}`);
  rows.push('');

  // Milestones
  rows.push('Project Milestones');
  rows.push('Date,Progress,Amount Spent,Comments');
  data.milestones.forEach(milestone => {
    rows.push(`"${milestone.date}","${milestone.progress}",${milestone.spent},"${milestone.comments}"`);
  });
  rows.push('');

  // Budget Changes
  rows.push('Budget Changes');
  rows.push('Date,Description,Amount,Requested By,Status,Approved By,Notes');
  data.budgetChanges.forEach(change => {
    rows.push(
      `"${change.date}","${change.description}",${change.amount},"${change.requestedBy}","${change.status}","${change.approvedBy || ''}","${change.notes || ''}"`
    );
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `project_report_${data.clientName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: ProjectData) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `project_data_${data.clientName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDFReport = (data: ProjectData) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Project Report - ${data.clientName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { border-bottom: 3px solid black; padding-bottom: 10px; }
        h2 { margin-top: 30px; border-bottom: 2px solid black; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid black; padding: 10px; text-align: left; }
        th { background-color: #f0f0f0; }
        .summary { margin: 20px 0; }
        .summary-item { margin: 10px 0; font-size: 16px; }
        .label { font-weight: bold; }
        .approved { background-color: #d4edda; }
        .rejected { background-color: #f8d7da; }
        .pending { background-color: #fff3cd; }
      </style>
    </head>
    <body>
      <h1>Project Report: ${data.clientName}</h1>
      <p>Generated: ${new Date().toLocaleDateString()}</p>

      <h2>Budget Summary</h2>
      <div class="summary">
        <div class="summary-item"><span class="label">Total Budget:</span> ${formatCurrency(data.totalBudget)}</div>
        <div class="summary-item"><span class="label">Spent to Date:</span> ${formatCurrency(data.spentBudget)}</div>
        <div class="summary-item"><span class="label">Budget Increase:</span> ${formatCurrency(data.budgetIncrease)}</div>
        <div class="summary-item"><span class="label">Remaining:</span> ${formatCurrency(data.totalBudget + data.budgetIncrease - data.spentBudget)}</div>
      </div>

      <h2>Project Milestones</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Progress</th>
            <th>Amount Spent</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          ${data.milestones.map(milestone => `
            <tr>
              <td>${milestone.date}</td>
              <td>${milestone.progress}</td>
              <td>${formatCurrency(milestone.spent)}</td>
              <td>${milestone.comments}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h2>Budget Changes</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${data.budgetChanges.map(change => `
            <tr class="${change.status}">
              <td>${change.date}</td>
              <td>${change.description}</td>
              <td>${formatCurrency(change.amount)}</td>
              <td>${change.requestedBy}</td>
              <td>${change.status.toUpperCase()}</td>
              <td>${change.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
