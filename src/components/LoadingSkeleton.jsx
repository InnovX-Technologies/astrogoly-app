import React from 'react';
import './LoadingSkeleton.css';

export const ChartSkeleton = () => (
    <div className="skeleton-wrapper">
        <div className="skeleton-header">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
        </div>
        <div className="skeleton-chart-grid">
            <div className="skeleton skeleton-chart-main"></div>
            <div className="skeleton-details">
                <div className="skeleton skeleton-detail-item"></div>
                <div className="skeleton skeleton-detail-item"></div>
                <div className="skeleton skeleton-detail-item"></div>
                <div className="skeleton skeleton-detail-item"></div>
            </div>
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton skeleton-icon"></div>
        <div className="skeleton skeleton-card-title"></div>
        <div className="skeleton skeleton-card-text"></div>
        <div className="skeleton skeleton-card-text short"></div>
    </div>
);

export const ListSkeleton = ({ count = 3 }) => (
    <div className="skeleton-list">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="skeleton-list-item">
                <div className="skeleton skeleton-avatar"></div>
                <div className="skeleton-list-content">
                    <div className="skeleton skeleton-list-title"></div>
                    <div className="skeleton skeleton-list-text"></div>
                </div>
            </div>
        ))}
    </div>
);

export default ChartSkeleton;
