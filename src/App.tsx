import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import AboutUs from './pages/AboutUs';
import Withdraw from './pages/Withdraw';
import CustomerService from './pages/CustomerService';
import Chat from './pages/Chat';
import Clause from './pages/Clause';
import Deposit from './pages/Deposit';
import DepositUpload from './pages/DepositUpload';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import BankInfo from './pages/BankInfo';
import WithdrawalAddress from './pages/WithdrawalAddress';
import WithdrawalRecord from './pages/WithdrawalRecord';
import RechargeRecord from './pages/RechargeRecord';
import Language from './pages/Language';
import ShoppingCenter from './pages/ShoppingCenter';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/about-us" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/bank-info" element={<ProtectedRoute><BankInfo /></ProtectedRoute>} />
            <Route path="/withdrawal-address" element={<ProtectedRoute><WithdrawalAddress /></ProtectedRoute>} />
            <Route path="/withdrawal-record" element={<ProtectedRoute><WithdrawalRecord /></ProtectedRoute>} />
            <Route path="/recharge-record" element={<ProtectedRoute><RechargeRecord /></ProtectedRoute>} />
            <Route path="/customer-service" element={<ProtectedRoute><CustomerService /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/clause" element={<ProtectedRoute><Clause /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/deposit-upload" element={<ProtectedRoute><DepositUpload /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/change-login-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/change-fund-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
            <Route path="/shopping-center" element={<ProtectedRoute><ShoppingCenter /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

