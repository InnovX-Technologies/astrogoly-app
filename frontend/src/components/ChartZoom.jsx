import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import './ChartZoom.css';

const ChartZoom = ({ children, minZoom = 0.5, maxZoom = 3, step = 0.25 }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + step, maxZoom));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - step, minZoom));
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleFitScreen = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const content = container.querySelector('.zoom-content');
            if (content) {
                const containerRect = container.getBoundingClientRect();
                const contentRect = content.getBoundingClientRect();
                const scaleX = containerRect.width / contentRect.width;
                const scaleY = containerRect.height / contentRect.height;
                const newZoom = Math.min(scaleX, scaleY, maxZoom);
                setZoom(newZoom);
                setPosition({ x: 0, y: 0 });
            }
        }
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -step : step;
            setZoom(prev => Math.max(minZoom, Math.min(maxZoom, prev + delta)));
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, []);

    return (
        <div className="chart-zoom-wrapper">
            <div className="zoom-controls">
                <button
                    className="zoom-btn"
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                    title="Zoom In (Ctrl + Scroll)"
                >
                    <ZoomIn size={18} />
                </button>
                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                <button
                    className="zoom-btn"
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                    title="Zoom Out (Ctrl + Scroll)"
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    className="zoom-btn"
                    onClick={handleFitScreen}
                    title="Fit to Screen"
                >
                    <Maximize2 size={18} />
                </button>
                <button
                    className="zoom-btn"
                    onClick={handleReset}
                    title="Reset View"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            <div
                ref={containerRef}
                className={`zoom-container ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="zoom-content"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ChartZoom;
