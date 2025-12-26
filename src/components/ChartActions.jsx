import React, { useState } from 'react';
import { Printer, Download, Share2, Copy, Loader2 } from 'lucide-react';
import { printKundli, exportAsImage, shareKundli, copyToClipboard } from '../utils/chartExport';
import './ChartActions.css';

const ChartActions = ({ chartId, chartName = 'kundli-chart', onAction }) => {
    const [loading, setLoading] = useState(null);

    const handleAction = async (action, actionFn) => {
        setLoading(action);
        try {
            const result = await actionFn();
            if (result.success) {
                onAction?.('success', `${action} completed successfully!`);
            } else {
                onAction?.('error', `Failed to ${action}: ${result.error}`);
            }
        } catch (error) {
            onAction?.('error', `Error during ${action}`);
        } finally {
            setLoading(null);
        }
    };

    const actions = [
        {
            id: 'print',
            icon: Printer,
            label: 'Print PDF',
            onClick: () => handleAction('print', () => printKundli(chartId, `${chartName}.pdf`))
        },
        {
            id: 'download',
            icon: Download,
            label: 'Download PNG',
            onClick: () => handleAction('download', () => exportAsImage(chartId, `${chartName}.png`))
        },
        {
            id: 'share',
            icon: Share2,
            label: 'Share',
            onClick: () => handleAction('share', () => shareKundli(chartId, { title: chartName }))
        },
        {
            id: 'copy',
            icon: Copy,
            label: 'Copy Image',
            onClick: () => handleAction('copy', () => copyToClipboard(chartId))
        }
    ];

    return (
        <div className="chart-actions">
            {actions.map(action => {
                const Icon = action.icon;
                const isLoading = loading === action.id;

                return (
                    <button
                        key={action.id}
                        className="chart-action-btn"
                        onClick={action.onClick}
                        disabled={loading !== null}
                        title={action.label}
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="spinner" />
                        ) : (
                            <Icon size={18} />
                        )}
                        <span>{action.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ChartActions;
