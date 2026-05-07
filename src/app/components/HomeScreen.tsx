import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeScreenProps {
  clientName: string;
  projectPhoto?: string;
  totalBudget: number;
  spentBudget: number;
  budgetIncrease: number;
  onNavigateToTracking: () => void;
  onNavigateToBudgetChanges: () => void;
  onNavigateToExport?: () => void;
}

export default function HomeScreen({
  clientName,
  projectPhoto,
  totalBudget,
  spentBudget,
  budgetIncrease,
  onNavigateToTracking,
  onNavigateToBudgetChanges,
  onNavigateToExport
}: HomeScreenProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-4 border-black p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-black">
            <div className="border-2 border-black p-4">
              <h1 className="text-xl">SPIRAL LOGO</h1>
            </div>
            <div className="text-right">
              <p className="text-lg">{clientName}</p>
            </div>
          </div>

          {/* Project Photo */}
          <div className="mb-8">
            <div className="border-2 border-black p-4 bg-gray-100 h-64 flex items-center justify-center">
              {projectPhoto ? (
                <ImageWithFallback
                  src={projectPhoto}
                  alt="Project Blueprint"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500">PROJECT BLUEPRINT PHOTO</p>
              )}
            </div>
          </div>

          {/* Budget Information */}
          <div className="space-y-4 mb-8">
            <div className="border-2 border-black p-4">
              <p className="text-sm mb-2">TOTAL Budget</p>
              <p className="text-2xl">{formatCurrency(totalBudget)}</p>
            </div>

            <div className="border-2 border-black p-4">
              <p className="text-sm mb-2">Budget Spent to Date</p>
              <p className="text-2xl">{formatCurrency(spentBudget)}</p>
            </div>

            <div className="border-2 border-black p-4 bg-yellow-50">
              <p className="text-sm mb-2">Budget Increase</p>
              <p className="text-2xl text-red-600">{formatCurrency(budgetIncrease)}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <button
              onClick={onNavigateToBudgetChanges}
              className="w-full border-2 border-black p-4 bg-white hover:bg-gray-100 transition-colors text-left"
            >
              Budget Changes and Approvals
            </button>

            <button
              onClick={onNavigateToTracking}
              className="w-full border-2 border-black p-4 bg-white hover:bg-gray-100 transition-colors text-left"
            >
              Project Tracking
            </button>

            {onNavigateToExport && (
              <button
                onClick={onNavigateToExport}
                className="w-full border-2 border-black p-4 bg-white hover:bg-gray-100 transition-colors text-left"
              >
                Export & Reports
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
