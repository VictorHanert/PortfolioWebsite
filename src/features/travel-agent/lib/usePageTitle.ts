import { useEffect } from 'react';

// Sets the browser tab title while a travel agent page is shown, and restores the portfolio's title after
export function usePageTitle(title: string) {
    useEffect(() => {
        const previous = document.title;
        document.title = title;
        return () => {
            document.title = previous;
        };
    }, [title]);
}
