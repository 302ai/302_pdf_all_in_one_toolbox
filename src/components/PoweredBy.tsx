import { useTranslation } from "react-i18next";
const region = import.meta.env.VITE_APP_REGION;
export default function PoweredBy() {
  const { t } = useTranslation()

  return (
    <>
      <div
        className="flex justify-center items-center gap-1 my-4 mb-2"
        style={{ color: "rgb(102, 102, 102)", fontSize: "12px" }}
      >
        Powered By
        <a
          target="_blank"
          href={region === '1' ? "https://302.ai/" : "https://302ai.cn/"}
        >
          <img
            className="object-contain"
            src="https://file.302.ai/gpt/imgs/91f7b86c2cf921f61e8cf9dc7b1ec5ee.png"
            alt="gpt302"
            width="55"
          />
        </a>
      </div>
      <div
        className="text-center mb-1"
        style={{ color: "rgb(200, 200, 200)", fontSize: "12px" }}
      >
        {t('poweredBy')}
      </div>
    </>
  );
}
