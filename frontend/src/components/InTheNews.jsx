import React from 'react';
import './InTheNews.css';

const InTheNews = () => {
    const newsItems = [
        {
            id: 1,
            publication: 'Inc42',
            logo: 'https://via.placeholder.com/120x40/4A90E2/FFFFFF?text=Inc42',
            headline: 'AstroNexa raises funding for AI-powered astrology',
            link: '#'
        },
        {
            id: 2,
            publication: 'ET Now',
            logo: 'https://via.placeholder.com/120x40/E74C3C/FFFFFF?text=ET+NOW',
            headline: 'How AstroNexa is revolutionizing online astrology',
            link: '#'
        },
        {
            id: 3,
            publication: 'YourStory',
            logo: 'https://via.placeholder.com/120x40/27AE60/FFFFFF?text=YourStory',
            headline: 'Meet the startup bringing Vedic wisdom online',
            link: '#'
        },
        {
            id: 4,
            publication: 'The Hindu',
            logo: 'https://via.placeholder.com/120x40/8E44AD/FFFFFF?text=The+Hindu',
            headline: 'Digital astrology platform sees massive growth',
            link: '#'
        }
    ];

    return (
        <section className="in-the-news-section">
            <div className="container">
                <div className="section-header">
                    <h2>AstroNexa in News</h2>
                    <p>Featured in leading publications</p>
                </div>

                <div className="news-slider">
                    <div className="news-track">
                        {[...newsItems, ...newsItems].map((item, index) => (
                            <a
                                key={`${item.id}-${index}`}
                                href={item.link}
                                className="news-card"
                            >
                                <div className="news-logo">
                                    <img src={item.logo} alt={item.publication} />
                                </div>
                                <p className="news-headline">{item.headline}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InTheNews;
