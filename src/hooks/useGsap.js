import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useFadeIn = (direction = 'up', distance = 100, delay = 0) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        let x = 0;
        let y = 0;

        if (direction === 'up') y = distance;
        if (direction === 'down') y = -distance;
        if (direction === 'left') x = distance;
        if (direction === 'right') x = -distance;

        gsap.fromTo(element, 
            { 
                opacity: 0, 
                x: x, 
                y: y 
            }, 
            { 
                opacity: 1, 
                x: 0, 
                y: 0, 
                duration: 1.2, 
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, [direction, distance, delay]);

    return elementRef;
};

export const useStaggerFadeIn = (delay = 0) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const children = container.children;

        gsap.fromTo(children, 
            { 
                opacity: 0, 
                y: 50 
            }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.15,
                delay: delay,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, [delay]);

    return containerRef;
};

export const useParallax = (speed = 20) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.to(element, {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }, [speed]);

    return elementRef;
};
