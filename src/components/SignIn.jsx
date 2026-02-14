import React, { useState } from 'react';
import { setUser } from '../utils/storage';

const SignIn = ({ onSignIn }) => {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Email or phone is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Простая аутентификация (демо: любой email/телефон с паролем "admin")
        if (formData.password === 'admin') {
            const user = {
                identifier: formData.identifier,
                loginTime: new Date().toISOString()
            };
            setUser(user);
            onSignIn(user);
        } else {
            setErrors({ password: 'Invalid credentials. Use password: admin' });
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <div className="signin-header">
                    <h1 className="signin-title">Welcome Back</h1>
                    <p className="signin-subtitle">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="signin-form">
                    <div className="input-group">
                        <label className="input-label" htmlFor="identifier">
                            Email or Phone Number
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleChange}
                            className={`input-field ${errors.identifier ? 'error' : ''}`}
                            placeholder="Enter your email or phone"
                        />
                        {errors.identifier && (
                            <span className="error-text">{errors.identifier}</span>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input-field ${errors.password ? 'error' : ''}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password}</span>
                        )}
                    </div>

                    <button type="submit" className="signin-btn">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
