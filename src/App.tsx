import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/bank-info" element={<BankInfo />} />
          <Route path="/withdrawal-address" element={<WithdrawalAddress />} />
          <Route path="/withdrawal-record" element={<WithdrawalRecord />} />
          <Route path="/recharge-record" element={<RechargeRecord />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/clause" element={<Clause />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/deposit-upload" element={<DepositUpload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-login-password" element={<ChangePassword />} />
          <Route path="/change-fund-password" element={<ChangePassword />} />
          <Route path="/language" element={<Language />} />
          <Route path="/shopping-center" element={<ShoppingCenter />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

