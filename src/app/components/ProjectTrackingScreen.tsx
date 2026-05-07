import { useState, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, Upload, Plus } from 'lucide-react';

interface Invoice {
  id: string;
  name: string;
  amount: number;
}

interface Change {
  id: string;
  description: string;
  amount: number;
}

interface ProjectMilestone {
  id: string;
  date: string;
  photo?: string;
  progress: string;
  spent: number;
  invoices: Invoice[];
  changes: Change[];
  comments: string;
}

interface ProjectTrackingScreenProps {
  clientName: string;
  milestones: ProjectMilestone[];
  onBack: () => void;
  onAddMilestone?: () => void;
  onUploadPhoto?: (milestoneId: string, file: File) => void;
}

export default function ProjectTrackingScreen({
  clientName,
  milestones,
  onBack,
  onAddMilestone,
  onUploadPhoto
}: ProjectTrackingScreenProps) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleMilestone = (id: string) => {
    setExpandedMilestone(expandedMilestone === id ? null : id);
  };

  const handleFileUpload = (milestoneId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUploadPhoto) {
      onUploadPhoto(milestoneId, file);
    }
  };

  const triggerFileInput = (milestoneId: string) => {
    fileInputRefs.current[milestoneId]?.click();
  };

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
                <p className="text-sm text-gray-600">Project Tracking</p>
              </div>
            </div>
          </div>

          {/* Add Milestone Button */}
          {onAddMilestone && (
            <div className="mb-6">
              <button
                onClick={onAddMilestone}
                className="flex items-center gap-2 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
                Add Date
              </button>
            </div>
          )}

          {/* Milestones Timeline */}
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="border-2 border-black">
                {/* Milestone Header */}
                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className="w-full bg-gray-200 p-4 text-left hover:bg-gray-300 transition-colors flex justify-between items-center"
                >
                  <span>{milestone.date}</span>
                  <span>{expandedMilestone === milestone.id ? '▼' : '▶'}</span>
                </button>

                {/* Milestone Details */}
                {expandedMilestone === milestone.id && (
                  <div className="p-6 space-y-6">
                    {/* Photo Section */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="mb-2">Photo</p>
                        <div className="border-2 border-black p-4 bg-gray-100 h-64 flex items-center justify-center relative">
                          {milestone.photo ? (
                            <ImageWithFallback
                              src={milestone.photo}
                              alt={`Photo ${milestone.date}`}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <p className="text-gray-500">No photo</p>
                          )}
                          {onUploadPhoto && (
                            <>
                              <input
                                ref={(el) => (fileInputRefs.current[milestone.id] = el)}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(milestone.id, e)}
                                className="hidden"
                              />
                              <button
                                onClick={() => triggerFileInput(milestone.id)}
                                className="absolute bottom-2 right-2 bg-black text-white p-2 rounded hover:bg-gray-800"
                                title="Upload photo"
                              >
                                <Upload size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Progress and Expenses */}
                      <div className="space-y-4">
                        <div className="border-2 border-black p-4">
                          <p className="text-sm mb-2">Progress</p>
                          <p>{milestone.progress}</p>
                        </div>

                        <div className="border-2 border-black p-4">
                          <p className="text-sm mb-2">Spent</p>
                          <p className="text-xl">{formatCurrency(milestone.spent)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div>
                      <p className="mb-3">Invoices</p>
                      <div className="space-y-2">
                        {milestone.invoices.map((invoice) => (
                          <div key={invoice.id} className="border-2 border-black p-3 flex justify-between items-center">
                            <span>{invoice.name}</span>
                            <span>{formatCurrency(invoice.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Changes and Approvals */}
                    <div>
                      <p className="mb-3">Changes and Approvals</p>
                      <div className="space-y-2">
                        {milestone.changes.map((change) => (
                          <div key={change.id} className="border-2 border-black p-3">
                            <p>{change.description}</p>
                            <p className="text-red-600">{formatCurrency(change.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    <div>
                      <p className="mb-3">Comments</p>
                      <div className="border-2 border-black p-4 bg-gray-50 min-h-[100px]">
                        <p className="whitespace-pre-wrap">{milestone.comments || 'No comments'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {milestones.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No dates registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
