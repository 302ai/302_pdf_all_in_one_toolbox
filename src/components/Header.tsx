import { useTranslation } from "react-i18next";
const hideBrand = import.meta.env.VITE_APP_SHOW_BRAND === 'true';
export default function Header() {
  const { t } = useTranslation()
  return <div className="flex justify-center items-center my-[24px] gap-1">
    {
      !hideBrand &&
      <img src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png" className="app-icon object-contain" alt="302" height={60} width={60} />
    }
    <div className="app-title">{t('title')}</div>
  </div>
}