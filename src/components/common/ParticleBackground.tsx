import React, { useMemo } from 'react';

export const ParticleBackground: React.FC = () => {
    const particles = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const top = Math.random() * 100 + 100; // Mulai dari bawah layar
            const animationDuration = Math.random() * 15 + 10;
            return (
                <div
                    key={i}
                    className="particle"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${left}%`,
                        top: `${top}%`,
                        animationDuration: `${animationDuration}s`,
                        opacity: Math.random()
                    }}
                />
            );
        });
    }, []);

    return <div className="particles">{particles}</div>;
};