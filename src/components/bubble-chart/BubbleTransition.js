export function createTransitions(node, params) {
    const {
        duration = 750,
        delay = 0,
        easing = cubicOut
    } = params || {};

    return {
        enter: (_, done) => {
            node.style.opacity = 0;
            node.style.transform = 'scale(0.1)';
            
            setTimeout(() => {
                node.style.transition = `all ${duration}ms ${easing}`;
                node.style.opacity = 1;
                node.style.transform = 'scale(1)';
            }, delay);

            return () => {
                node.style.transition = '';
            };
        },
        
        update: (_, done) => {
            node.style.transition = `all ${duration}ms ${easing}`;
            return () => {
                node.style.transition = '';
            };
        },
        
        exit: (_, done) => {
            node.style.transition = `all ${duration}ms ${easing}`;
            node.style.opacity = 0;
            node.style.transform = 'scale(0.1)';

            return () => {
                node.style.transition = '';
            };
        }
    };
}

function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
}