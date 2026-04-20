import React from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './Auth.scss';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="auth-page">
            <Head title="Create Account" />
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
                    <h1 className="auth-card__title">Create Account</h1>
                    <p className="auth-card__subtitle">Join the premium shopping experience</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-card__form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-icon-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className={`form-input form-input--icon ${errors.name ? 'form-input--error' : ''}`}
                                placeholder="John Doe"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

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
                                placeholder="Min 8 characters"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="input-icon-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                className="form-input form-input--icon"
                                placeholder="Confirm your password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary auth-card__submit" disabled={processing}>
                        {processing ? 'Creating Account...' : 'Create Account'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <p className="auth-card__footer">
                    Already have an account?{' '}
                    <Link href="/login" className="auth-card__link">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
