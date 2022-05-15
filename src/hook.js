import { useState } from 'react';

export default function useForceRender() {
    const [, setRender] = useState();
    function forceRender() {
        setRender({});
    }
    return forceRender;
}