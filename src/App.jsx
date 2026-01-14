import { Routes, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import { Toaster } from 'react-hot-toast';
import CategorySelection from './CategorySelection';
import ExportPage from './ExportPage';
import ThanksPage from './ThanksPage';
import './App.css';

function App() {
  return (
    <div className="w-full flex justify-center p-0 md:p-4">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#bae6fd',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0f172a',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<CategorySelection />} />
        <Route path="/newcomers" element={<RegistrationForm category="Newcomers" />} />
        <Route path="/phase1" element={<RegistrationForm category="Phase 1" />} />
        <Route path="/phase2" element={<RegistrationForm category="Phase 2" />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="/thanks" element={<ThanksPage />} />
      </Routes>
    </div>
  );
}

export default App;
