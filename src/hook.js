import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function useForceRender() {
    const [, setRender] = useState();
    function forceRender() {
        setRender({});
    }
    return forceRender;
}

export function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  