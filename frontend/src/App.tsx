import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EvaluateResponsePage } from './pages/EvaluateResponsePage';
import { EvaluationResultsPage } from './pages/EvaluationResultsPage';
import { EvaluationHistoryPage } from './pages/EvaluationHistoryPage';
import { AgentArchitecturePage } from './pages/AgentArchitecturePage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AnalyticsReportsPage } from './pages/AnalyticsReportsPage';
import { BatchEvaluationPage } from './pages/BatchEvaluationPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="evaluate" element={<EvaluateResponsePage />} />
          <Route path="evaluations/:evaluationId" element={<EvaluationResultsPage />} />
          <Route path="history" element={<EvaluationHistoryPage />} />
          <Route path="agents" element={<AgentArchitecturePage />} />
          <Route path="knowledge-base" element={<KnowledgeBasePage />} />
          <Route path="analytics" element={<AnalyticsReportsPage />} />
          <Route path="batch-evaluation" element={<BatchEvaluationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
