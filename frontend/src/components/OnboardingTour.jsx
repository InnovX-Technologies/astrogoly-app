import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import './OnboardingTour.css';

const OnboardingTour = ({ steps, onComplete, storageKey = 'onboarding-completed' }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Check if user has already completed the tour
        const hasCompleted = localStorage.getItem(storageKey);
        if (!hasCompleted) {
            // Small delay before showing tour
            setTimeout(() => setIsActive(true), 1000);
        }
    }, [storageKey]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        completeTour();
    };

    const completeTour = () => {
        localStorage.setItem(storageKey, 'true');
        setIsActive(false);
        onComplete?.();
    };

    const goToStep = (index) => {
        setCurrentStep(index);
    };

    if (!isActive || !steps || steps.length === 0) {
        return null;
    }

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    return (
        <>
            {/* Overlay */}
            <div className="onboarding-overlay" onClick={handleSkip} />

            {/* Spotlight */}
            {step.target && (
                <div
                    className="onboarding-spotlight"
                    style={{
                        top: step.position?.top || 'auto',
                        left: step.position?.left || 'auto',
                        right: step.position?.right || 'auto',
                        bottom: step.position?.bottom || 'auto',
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                className={`onboarding-tooltip ${step.placement || 'bottom'}`}
                style={{
                    top: step.position?.top || 'auto',
                    left: step.position?.left || 'auto',
                    right: step.position?.right || 'auto',
                    bottom: step.position?.bottom || 'auto',
                }}
            >
                <button className="tooltip-close" onClick={handleSkip}>
                    <X size={18} />
                </button>

                <div className="tooltip-content">
                    {step.icon && (
                        <div className="tooltip-icon">
                            {step.icon}
                        </div>
                    )}
                    <h3 className="tooltip-title">{step.title}</h3>
                    <p className="tooltip-description">{step.description}</p>
                </div>

                <div className="tooltip-footer">
                    <div className="step-indicators">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                className={`step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                onClick={() => goToStep(index)}
                            />
                        ))}
                    </div>

                    <div className="tooltip-actions">
                        {currentStep > 0 && (
                            <button className="btn-tour btn-secondary" onClick={handlePrevious}>
                                <ChevronLeft size={16} />
                                Previous
                            </button>
                        )}
                        <button className="btn-tour btn-primary" onClick={handleNext}>
                            {isLastStep ? (
                                <>
                                    <Check size={16} />
                                    Finish
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="tooltip-arrow" />
            </div>
        </>
    );
};

export default OnboardingTour;
