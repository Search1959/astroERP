/**
 * Dual-Tab Authentication Portal Modal
 * Tab 1: Create NEW Account (Company name, Astrologer name, ID, Password) -> initializes Fresh 0-Data Workspace
 * Tab 2: Sign In / Member Login (User ID/Email, Password) -> lands on Dashboard with saved data
 */

import React, { useState } from 'react';
import { User } from '../../types';
import {
  X,
  Shield,
  Lock,
  UserPlus,
  LogIn,
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  Key,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signup' | 'login';
  registeredUsers: User[];
  onRegisterAccount: (newUserData: {
    companyName: string;
    astrologerName: string;
    username: string;
    email: string;
    phone: string;
    specialty: string;
    password: string;
  }) => void;
  onLoginAccount: (identifier: string, password: string) => { success: boolean; message?: string; user?: User };
  onLaunchDemoUser: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  registeredUsers,
  onRegisterAccount,
  onLoginAccount,
  onLaunchDemoUser,
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(initialTab);

  // Sign Up Form States
  const [companyName, setCompanyName] = useState('');
  const [astrologerName, setAstrologerName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Vedic Parashari & Gemology');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Feedback State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim() || !astrologerName.trim() || !username.trim() || !email.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Check if username or email already exists
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const existing = registeredUsers.find(
      u => (u.username && u.username.toLowerCase() === cleanUsername) || u.email.toLowerCase() === cleanEmail
    );

    if (existing) {
      setErrorMessage(`An account with username '${username}' or email '${email}' already exists.`);
      return;
    }

    onRegisterAccount({
      companyName: companyName.trim(),
      astrologerName: astrologerName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: phone.trim(),
      specialty,
      password: signupPassword,
    });

    setSuccessMessage('Account created successfully! Loading your fresh 0-data workspace...');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both User ID/Email and Password.');
      return;
    }

    const result = onLoginAccount(loginIdentifier.trim(), loginPassword);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid User ID or Password.');
      return;
    }

    setSuccessMessage(`Welcome back, ${result.user?.name}!`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleQuickFill = (u: string, p: string) => {
    setLoginIdentifier(u);
    setLoginPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b0f2a] border border-indigo-900/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AstroNexus Access Portal</h3>
              <p className="text-xs text-slate-400">Astrological Ephemeris & Gemstone Command Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Tab Navigation Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#050816] border border-indigo-950 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create NEW Account</span>
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab 1: CREATE NEW ACCOUNT (0 Data Workspace) */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Fresh Clean Workspace:</strong> All new registered accounts start with exactly 0 clients, 0
                gemstones, 0 consultations, and 0 sales — completely ready for your private practice data.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Company / Clinic Name */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Company / Astrology Clinic Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Navagraha Vedic Consultancy"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                />
              </div>

              {/* Astrologer Name */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Astrologer / Owner Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={astrologerName}
                  onChange={e => setAstrologerName(e.target.value)}
                  placeholder="e.g. Pt. Harishankar Joshi"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* Login ID / Username */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Login User ID (Username) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="e.g. harishankar_vedic"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none font-mono"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. contact@jyotish.com"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Phone / WhatsApp Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* Specialty */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Astrological Specialization</span>
                </label>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                >
                  <option value="Vedic Parashari & Gemology">Vedic Parashari & Gemology (पाराशरी एवं रत्नशास्त्र)</option>
                  <option value="KP System & Transit Astrology">KP System & Transit Astrology (कृष्णमूर्ति पद्धति)</option>
                  <option value="Nadi Astrology & Palmistry">Nadi Astrology & Palmistry (नाड़ी ज्योतिष एवं हस्तरेखा)</option>
                  <option value="Certified Gemologist & Jewelry Store">Certified Gemologist & Jewelry Store (रत्न एवं आभूषण)</option>
                  <option value="Western & Medical Astrology">Western & Medical Astrology</option>
                  <option value="Vastu Shastra & Yantra Remedials">Vastu Shastra & Yantra Remedials</option>
                </select>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Password *</span>
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Min 4 characters"
                    className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-amber-400 outline-none pr-8 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Confirm Password *</span>
                </label>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-amber-400 outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Create Account & Enter Zero-Data Workspace
            </button>
          </form>
        )}

        {/* Tab 2: SIGN IN / MEMBER LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-3.5 text-xs">
              {/* ID or Email */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>User ID / Username or Email Address *</span>
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. apex7tech@gmail.com, demo, or your User ID"
                  className="w-full px-3.5 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Password *</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-3.5 py-2.5 bg-[#050816] border border-indigo-950 rounded-xl text-white text-xs focus:ring-1 focus:ring-indigo-400 outline-none pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              Sign In to Dashboard
            </button>

            {/* Quick Demo & Pre-seeded Logins Bar */}
            <div className="pt-3 border-t border-indigo-950 space-y-2">
              <p className="text-[10px] text-slate-400 text-center font-medium">Quick One-Click Test Accounts:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickFill('apex7tech@gmail.com', 'Search@1959')}
                  className="p-2 rounded-lg bg-[#050816] hover:bg-slate-900 border border-indigo-950 hover:border-amber-500/40 text-left transition cursor-pointer"
                >
                  <span className="font-bold text-amber-300 block">👑 Super Admin</span>
                  <span className="text-slate-400 block font-mono text-[9px] truncate">apex7tech@gmail.com / Search@1959</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('demo', 'demo123')}
                  className="p-2 rounded-lg bg-[#050816] hover:bg-slate-900 border border-indigo-950 hover:border-indigo-500/40 text-left transition cursor-pointer"
                >
                  <span className="font-bold text-indigo-300 block">✨ Demo Evaluator</span>
                  <span className="text-slate-400 block font-mono">demo / demo123</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Bottom Switcher Note */}
        <div className="pt-2 border-t border-indigo-950 text-center">
          <button
            type="button"
            onClick={onLaunchDemoUser}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Direct Demo Access (One-click entry without credentials)
          </button>
        </div>
      </div>
    </div>
  );
};
