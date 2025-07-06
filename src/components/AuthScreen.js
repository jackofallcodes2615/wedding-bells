import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../App';
import { Heart, Mail, Lock, Phone } from 'lucide-react';

const AuthScreen = () => {
  const [authMode, setAuthMode] = useState('google'); // 'email', 'google', 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Initialize recaptcha for phone auth
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log('Recaptcha resolved');
        }
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmationResult);
      setError('');
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(verificationCode);
    } catch (error) {
      setError('Invalid verification code');
    }
    
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Wedding Bells</h1>
          <p className="text-white/80">Plan your perfect day within budget</p>
        </div>

        {/* Auth Method Selection */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setAuthMode('google')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              authMode === 'google' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white bg-white/10'
            }`}
          >
            Gmail
          </button>
          <button
            onClick={() => setAuthMode('phone')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              authMode === 'phone' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white bg-white/10'
            }`}
          >
            Phone
          </button>
          <button
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              authMode === 'email' ? 'bg-white/30 text-white' : 'text-white/70 hover:text-white bg-white/10'
            }`}
          >
            Email
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-white text-sm mb-6">
            {error}
          </div>
        )}

        {/* Google Sign-In */}
        {authMode === 'google' && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in with Google...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <p className="text-white/60 text-sm text-center">
              Quick and secure sign-in with your Gmail account
            </p>
          </div>
        )}

        {/* Phone Authentication */}
        {authMode === 'phone' && (
          <div className="space-y-4">
            {!confirmationResult ? (
              <form onSubmit={handlePhoneAuth}>
                <div className="relative mb-4">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-field pl-12"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
                <div id="recaptcha-container"></div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="input-field text-center text-2xl tracking-widest"
                    maxLength="6"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmationResult(null);
                    setVerificationCode('');
                  }}
                  className="btn-secondary w-full mt-2"
                >
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        )}

        {/* Email Authentication */}
        {authMode === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;