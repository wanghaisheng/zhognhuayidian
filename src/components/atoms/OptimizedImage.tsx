import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming standard shadcn utils

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    fallbackSrc = '/placeholder.svg', // Ensure this asset exists or using a generic one
    priority = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);

    useEffect(() => {
        setCurrentSrc(src);
        setIsLoaded(false);
        setError(false);
    }, [src]);

    return (
        <img
            src={error ? fallbackSrc : currentSrc}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            // @ts-expect-error - fetchPriority is standard but React types might lag
            fetchpriority={priority ? "high" : "auto"}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className={cn(
                "transition-all duration-500 ease-in-out",
                isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
                className
            )}
            {...props}
        />
    );
};
