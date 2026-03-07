/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import VerificationPage from './pages/VerificationPage';
import DiscordCallback from './pages/DiscordCallback';
import AdfsCallback from './pages/AdfsCallback';
import AdminPanel from './pages/AdminPanel';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/verify/discord/callback" element={<DiscordCallback />} />
          <Route path="/verify/adfs/callback" element={<AdfsCallback />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
