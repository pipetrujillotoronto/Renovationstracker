import { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ProjectTrackingScreen from './components/ProjectTrackingScreen';
import BudgetChangesScreen, { BudgetChange } from './components/BudgetChangesScreen';
import ExportReportScreen from './components/ExportReportScreen';

type Screen = 'login' | 'home' | 'tracking' | 'budget-changes' | 'export';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock project data with state
  const [projectData, setProjectData] = useState({
    clientName: 'John Smith',
    totalBudget: 1200500000,
    spentBudget: 318000,
    budgetIncrease: 9000,
    milestones: [
      {
        id: '1',
        date: 'Date 1 - January 15, 2026',
        photo: '',
        progress: 'Completed foundation and base structure',
        spent: 150000000,
        invoices: [
          { id: 'inv1', name: 'Invoice 1 - Materials', amount: 80000 },
          { id: 'inv2', name: 'Invoice 2 - Labor', amount: 70000 }
        ],
        changes: [
          { id: 'ch1', description: 'Change 1 - Column reinforcement', amount: 5000 }
        ],
        comments: 'Foundation completed as planned. Additional column reinforcement required per structural engineer recommendation.'
      },
      {
        id: '2',
        date: 'Date 2 - February 28, 2026',
        photo: '',
        progress: 'Walls and roof construction',
        spent: 168000000,
        invoices: [
          { id: 'inv3', name: 'Invoice 1 - Bricks and cement', amount: 90000 },
          { id: 'inv4', name: 'Invoice 2 - Electrical installations', amount: 78000 }
        ],
        changes: [
          { id: 'ch2', description: 'Change 1 - Electrical design modification', amount: 4000 }
        ],
        comments: 'Progress on schedule. Electrical design adjusted to improve outlet distribution.'
      }
    ] as ProjectMilestone[],
    budgetChanges: [
      {
        id: 'bc1',
        date: '2026-01-20',
        description: 'Additional column reinforcement required for seismic compliance',
        amount: 50000,
        requestedBy: 'Carl Watts',
        status: 'approved' as const,
        approvedBy: 'John Smith',
        approvalDate: '2026-01-21',
        notes: 'Approved for safety compliance'
      },
      {
        id: 'bc2',
        date: '2026-02-15',
        description: 'Upgrade electrical system to support future solar panel installation',
        amount: 4000,
        requestedBy: 'Linda Mark',
        status: 'approved' as const,
        approvedBy: 'John Smith',
        approvalDate: '2026-02-16',
        notes: 'Future-proofing investment approved'
      },
      {
        id: 'bc3',
        date: '2026-03-01',
        description: 'Premium finish materials for main entrance',
        amount: 8000,
        requestedBy: 'Anne Hazne',
        status: 'pending' as const
      }
    ] as BudgetChange[]
  });

  const handleLogin = (username: string, password: string) => {
    // Mock authentication - in production, this would validate against a real backend
    if (username && password) {
      setIsAuthenticated(true);
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const navigateToHome = () => setCurrentScreen('home');
  const navigateToTracking = () => setCurrentScreen('tracking');
  const navigateToBudgetChanges = () => setCurrentScreen('budget-changes');
  const navigateToExport = () => setCurrentScreen('export');

  // Photo upload handler
  const handlePhotoUpload = (milestoneId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoUrl = e.target?.result as string;
      setProjectData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m =>
          m.id === milestoneId ? { ...m, photo: photoUrl } : m
        )
      }));
    };
    reader.readAsDataURL(file);
  };

  // Budget change handlers
  const handleApproveChange = (changeId: string, notes: string) => {
    setProjectData(prev => ({
      ...prev,
      budgetChanges: prev.budgetChanges.map(c =>
        c.id === changeId
          ? {
              ...c,
              status: 'approved' as const,
              approvedBy: prev.clientName,
              approvalDate: new Date().toISOString().split('T')[0],
              notes
            }
          : c
      ),
      budgetIncrease: prev.budgetIncrease + (
        prev.budgetChanges.find(c => c.id === changeId)?.amount || 0
      )
    }));
  };

  const handleRejectChange = (changeId: string, notes: string) => {
    setProjectData(prev => ({
      ...prev,
      budgetChanges: prev.budgetChanges.map(c =>
        c.id === changeId
          ? { ...c, status: 'rejected' as const, notes }
          : c
      )
    }));
  };

  const handleAddChange = (change: Omit<BudgetChange, 'id' | 'status'>) => {
    const newChange: BudgetChange = {
      ...change,
      id: `bc${Date.now()}`,
      status: 'pending'
    };
    setProjectData(prev => ({
      ...prev,
      budgetChanges: [...prev.budgetChanges, newChange]
    }));
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentScreen === 'home') {
    return (
      <HomeScreen
        clientName={projectData.clientName}
        totalBudget={projectData.totalBudget}
        spentBudget={projectData.spentBudget}
        budgetIncrease={projectData.budgetIncrease}
        onNavigateToTracking={navigateToTracking}
        onNavigateToBudgetChanges={navigateToBudgetChanges}
        onNavigateToExport={navigateToExport}
      />
    );
  }

  if (currentScreen === 'tracking') {
    return (
      <ProjectTrackingScreen
        clientName={projectData.clientName}
        milestones={projectData.milestones}
        onBack={navigateToHome}
        onUploadPhoto={handlePhotoUpload}
      />
    );
  }

  if (currentScreen === 'budget-changes') {
    return (
      <BudgetChangesScreen
        clientName={projectData.clientName}
        changes={projectData.budgetChanges}
        onBack={navigateToHome}
        onApproveChange={handleApproveChange}
        onRejectChange={handleRejectChange}
        onAddChange={handleAddChange}
      />
    );
  }

  if (currentScreen === 'export') {
    return (
      <ExportReportScreen
        clientName={projectData.clientName}
        totalBudget={projectData.totalBudget}
        spentBudget={projectData.spentBudget}
        budgetIncrease={projectData.budgetIncrease}
        milestones={projectData.milestones}
        budgetChanges={projectData.budgetChanges}
        onBack={navigateToHome}
      />
    );
  }

  return null;
}