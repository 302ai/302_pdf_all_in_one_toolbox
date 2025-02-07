import { useEffect } from 'react';
import { useAppSelector } from './store/hooks';
import { selectGlobal } from './store/globalSlice';
const hideBrand = import.meta.env.VITE_APP_SHOW_BRAND === 'true';
const ScriptLoader = () => {
  const global = useAppSelector(selectGlobal)

  useEffect(() => {
    const width = document.body.clientWidth;
    console.log(global);

    if (width > 768 && !hideBrand) {
      const script = document.createElement('script');
      script.src =
        'https://assets.salesmartly.com/js/project_177_61_1649762323.js';
      document.body.appendChild(script);
    }
  }, [hideBrand]);

  return null;
};

export default ScriptLoader;