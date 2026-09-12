import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CalendarView } from './components/calendar/CalendarView';
import { AiGeneratorView } from './components/generator/AiGeneratorView';
import { BrandVoiceView } from './components/brand/BrandVoiceView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CompetitorAnalyticsView } from './components/analytics/CompetitorAnalyticsView';
import { PerformancePredictionView } from './components/analytics/PerformancePredictionView';
import { TeamView } from './components/team/TeamView';
import { IntegrationsView } from './components/integrations/IntegrationsView';
import { SettingsView } from './components/settings/SettingsView';
import { PublisherLogsView } from './components/logs/PublisherLogsView';

const MainAppContent: React.FC = () => {
  const { currentView } = useApp();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingWizard />;
  }

  return (
    <AppLayout>
      {currentView === 'dashboard' && <DashboardOverview />}
      {currentView === 'calendar' && <CalendarView />}
      {(currentView === 'content' || currentView === 'generator' || currentView === 'media' || currentView === 'scheduled') && <AiGeneratorView />}
      {currentView === 'team' && <TeamView />}
      {currentView === 'competitors' && <CompetitorAnalyticsView />}
      {currentView === 'predictions' && <PerformancePredictionView />}
      {currentView === 'brand' && <BrandVoiceView />}
      {currentView === 'analytics' && <AnalyticsView />}
      {(currentView === 'integrations' || currentView === 'social' || currentView === 'profile') && <IntegrationsView />}
      {currentView === 'settings' && <SettingsView />}
      {currentView === 'logs' && <PublisherLogsView />}
    </AppLayout>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
