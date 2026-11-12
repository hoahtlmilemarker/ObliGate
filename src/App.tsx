import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ColorModeProvider } from '@/theme/ColorModeProvider';
import { PageLoader, ToastProvider } from '@/components';
import { routes } from '@/layout/nav';
import { RouteLoadingProvider } from '@/layout/RouteLoading';
import { BootLoaderDone } from '@/layout/BootLoader';

const SignIn = lazy(() => import('@/pages/SignIn'));
const DisasterPortfolio = lazy(() => import('@/pages/DisasterPortfolio'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const DocumentLibrary = lazy(() => import('@/pages/DocumentLibrary'));
const DocumentLibraryEmpty = lazy(() => import('@/pages/DocumentLibraryEmpty'));
const UnplacedInbox = lazy(() => import('@/pages/UnplacedInbox'));
const DocumentReview = lazy(() => import('@/pages/DocumentReview'));
const CrossCheck = lazy(() => import('@/pages/CrossCheck'));
const ImportWizard = lazy(() => import('@/pages/ImportWizard'));
const PreSubmission = lazy(() => import('@/pages/PreSubmission'));
const SupervisorSignature = lazy(() => import('@/pages/SupervisorSignature'));
const UploadStart = lazy(() => import('@/pages/Upload/Start'));
const AnalysisRunning = lazy(() => import('@/pages/Upload/Running'));
const AnalysisReport = lazy(() => import('@/pages/Upload/Report'));
const Team = lazy(() => import('@/pages/Team'));
const Security = lazy(() => import('@/pages/Settings/Security'));
const ProfileBranding = lazy(() => import('@/pages/Settings/ProfileBranding'));
const PolicyThresholds = lazy(() => import('@/pages/Settings/PolicyThresholds'));
const DisastersScope = lazy(() => import('@/pages/Settings/Simple').then((m) => ({ default: m.DisastersScope })));
const FindingOverrides = lazy(() => import('@/pages/Settings/Simple').then((m) => ({ default: m.FindingOverrides })));
const Notifications = lazy(() => import('@/pages/Settings/Simple').then((m) => ({ default: m.Notifications })));
const DataRetention = lazy(() => import('@/pages/Settings/Simple').then((m) => ({ default: m.DataRetention })));
const ReviewerPatterns = lazy(() => import('@/pages/Settings/Simple').then((m) => ({ default: m.ReviewerPatterns })));

export function App() {
  return (
    <ColorModeProvider>
      <ToastProvider>
        <BrowserRouter>
          <RouteLoadingProvider>
          <BootLoaderDone />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to={routes.signIn} replace />} />
              <Route path={routes.signIn} element={<SignIn />} />
              <Route path={routes.disasters} element={<DisasterPortfolio />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path={routes.library} element={<DocumentLibrary />} />
              <Route path="/library/:projectId/:folder" element={<DocumentLibraryEmpty />} />
              <Route path={routes.inbox} element={<UnplacedInbox />} />
              <Route path={routes.review} element={<DocumentReview />} />
              <Route path={routes.crossCheck} element={<CrossCheck />} />
              <Route path={routes.importWizard} element={<ImportWizard />} />
              <Route path={routes.preSubmission} element={<PreSubmission />} />
              <Route path={routes.signature} element={<SupervisorSignature />} />
              <Route path={routes.upload} element={<UploadStart />} />
              <Route path={routes.analyzing} element={<AnalysisRunning />} />
              <Route path={routes.analysisReport} element={<AnalysisReport />} />
              <Route path={routes.team} element={<Team />} />
              <Route path="/settings" element={<Navigate to={routes.settings} replace />} />
              <Route path="/settings/security" element={<Security />} />
              <Route path="/settings/profile" element={<ProfileBranding />} />
              <Route path="/settings/disasters-scope" element={<DisastersScope />} />
              <Route path="/settings/policy-thresholds" element={<PolicyThresholds />} />
              <Route path="/settings/finding-overrides" element={<FindingOverrides />} />
              <Route path="/settings/notifications" element={<Notifications />} />
              <Route path="/settings/data-retention" element={<DataRetention />} />
              <Route path="/settings/reviewer-patterns" element={<ReviewerPatterns />} />
              <Route path="/account/profile" element={<Navigate to={routes.profile} replace />} />
              <Route path="/account/notifications" element={<Navigate to={routes.notifications} replace />} />
              <Route path="*" element={<Navigate to={routes.signIn} replace />} />
            </Routes>
          </Suspense>
          </RouteLoadingProvider>
        </BrowserRouter>
      </ToastProvider>
    </ColorModeProvider>
  );
}
