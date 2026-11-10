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
const MyProfile = lazy(() => import('@/pages/MyProfile'));
const NotificationSettings = lazy(() => import('@/pages/NotificationSettings'));

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
              <Route path={routes.profile} element={<MyProfile />} />
              <Route path={routes.notifications} element={<NotificationSettings />} />
              <Route path="*" element={<Navigate to={routes.signIn} replace />} />
            </Routes>
          </Suspense>
          </RouteLoadingProvider>
        </BrowserRouter>
      </ToastProvider>
    </ColorModeProvider>
  );
}
