import React from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './Auth.scss';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="auth-page">
            <Head title="Login" />
            <div className="auth-page__bg">
                <div className="auth-page__orb auth-page__orb--1" />
                <div className="auth-page__orb auth-page__orb--2" />
            </div>

            <div className="auth-card glass-card">
                <div className="auth-card__header">
                    <Link href="/" className="auth-card__logo">
                        <span className="auth-card__logo-text">SHOP</span>
                        <span className="auth-card__logo-accent">HUB</span>
                    </Link>
                    <h1 className="auth-card__title">Welcome Back</h1>
                    <p className="auth-card__subtitle">Sign in to continue shopping</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-card__form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-icon-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                className={`form-input form-input--icon ${errors.email ? 'form-input--error' : ''}`}
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-icon-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-input form-input--icon ${errors.password ? 'form-input--error' : ''}`}
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                className="input-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <div className="auth-card__options">
                        <label className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="checkbox-custom" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="auth-card__forgot">Forgot password?</a>
                    </div>

                    <button type="submit" className="btn-primary auth-card__submit" disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign In'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-card__divider">
                    <span>or continue with</span>
                </div>

                <button className="auth-card__social-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <p className="auth-card__footer">
                    Don't have an account?{' '}
                    <Link href="/register" className="auth-card__link">Create Account</Link>
                </p>
            </div>
        </div>
    );
}
