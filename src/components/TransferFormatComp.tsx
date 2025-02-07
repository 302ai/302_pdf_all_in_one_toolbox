import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { cn, onDownloadHandle } from "./../utils";
import ReturnBtn from "./ReturnBtn";
import { useAppSelector } from "../store/hooks";
import { selectGlobal } from "../store/globalSlice";
import { toast } from "react-toastify";
import { marked } from "marked";
import { useTranslation } from "react-i18next";

type PropTypes = {
  originURL: string;
  isHeightOfA4: boolean;
  onBackHandle: Function;
  uuid: string;
  upload_url: string;

};
const apiKey = import.meta.env.VITE_APP_API_KEY;
export default function TransferFormatComp(props: PropTypes) {
  const { t } = useTranslation()

  const globalState = useAppSelector(selectGlobal);

  const [isMobile, setIsMobile] = useState(false);

  const [isTansferingPng, setIsTansferingPng] = useState(false);
  const [isTansferingJpg, setIsTansferingJpg] = useState(false);
  const [isTansferingDocx, setIsTansferingDocx] = useState(false);
  const [isTansferingMd, setIsTansferingMd] = useState(false);
  const [isTansferingHtml, setIsTansferingHtml] = useState(false);

  const setIsShowDiffPDF = () => {
    const flag = window.innerWidth <= 768 ? true : false;
    setIsMobile(flag);
  };

  useEffect(() => {
    window.onresize = function () {
      setIsShowDiffPDF();
    };
    setIsShowDiffPDF();
    return () => {
      window.onresize = null;
    };
  }, []);

  const requestTransFer = async (to: string) => {
    const uuid = props.uuid ? props.uuid : "";
    const upload_url = props.upload_url;
    return await fetch("/api/v1/file/convert", {
      method: "post",
      body: JSON.stringify({
        uuid,
        upload_url,
        api_key: apiKey,
        to,
      }),
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
    });
  };

  const onTranslateFormatOfMd = async () => {
    setIsTansferingMd(true);
    try {
      const resp = (await requestTransFer("md")) as Response;
      const str = resp.headers.get("Content-Disposition");
      const filename = decodeURIComponent(str?.split("'")[2] as string);
      const content = await resp.text();
      const blob = new Blob([content]);
      onDownloadHandle(blob, filename);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        theme: "light",
        closeButton: false,
      });
    } finally {
      setIsTansferingMd(false);
    }
  };

  const onTranslateFormatOfHtml = async () => {
    setIsTansferingHtml(true);
    try {
      const resp = (await requestTransFer("md")) as Response;
      const str = resp.headers.get("Content-Disposition");
      const name = decodeURIComponent(str?.split("'")[2] as string);
      const filename = name.split(".")[0] + ".html";
      const content = await resp.text();
      const html = marked.parse(content) as string;
      const blob = new Blob([html]);
      onDownloadHandle(blob, filename);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        theme: "light",
        closeButton: false,
      });
    } finally {
      setIsTansferingHtml(false);
    }
  };

  const onTranslateFormatOfDocx = async () => {
    setIsTansferingDocx(true);
    try {
      const resp = (await requestTransFer("docx")) as Response;
      const str = resp.headers.get("Content-Disposition");
      const name = decodeURIComponent(str?.split("'")[2] as string);
      const blob = await resp.blob();
      onDownloadHandle(blob, name);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        theme: "light",
        closeButton: false,
      });
    } finally {
      setIsTansferingDocx(false);
    }
  };

  const onTranslateFormatOfJpg = async () => {
    setIsTansferingJpg(true);
    try {
      const resp = (await requestTransFer("jpg")) as Response;
      const str = resp.headers.get("Content-Disposition");
      const name = decodeURIComponent(str?.split("'")[2] as string);
      const blob = await resp.blob();
      onDownloadHandle(blob, name);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        theme: "light",
        closeButton: false,
      });
    } finally {
      setIsTansferingJpg(false);
    }
  };

  const onTranslateFormatOfPng = async () => {
    setIsTansferingPng(true);
    try {
      const resp = (await requestTransFer("png")) as Response;
      const str = resp.headers.get("Content-Disposition");
      const name = decodeURIComponent(str?.split("'")[2] as string);
      const blob = await resp.blob();
      onDownloadHandle(blob, name);
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        theme: "light",
        closeButton: false,
      });
    } finally {
      setIsTansferingPng(false);
    }
  };

  return (
    <div className="pb-[30px] w-full">
      <div className={cn("py-[30px] w-full", isMobile ? '' : 'flex justify-center')}>
        <ReturnBtn
          language={globalState.language}
          type="transfer"
          onReturnHandle={props.onBackHandle}
          disabled={
            isTansferingDocx ||
            isTansferingJpg ||
            isTansferingMd ||
            isTansferingPng ||
            isTansferingHtml
          }
        />
        {!isMobile && (
          <div className="w-full ml-4 flex justify-center">
            {!isTansferingMd &&
              !isTansferingDocx &&
              !isTansferingJpg &&
              !isTansferingPng && (
                <Button
                  disabled={isTansferingHtml}
                  data-type="markdown"
                  onClick={onTranslateFormatOfHtml}
                  className="w-[100px] mr-6 bg-rose-500 hover:bg-rose-600 active:bg-rose-600"
                >
                  {isTansferingHtml ? t('transition') : "HTML"}
                </Button>
              )}
            {!isTansferingDocx &&
              !isTansferingJpg &&
              !isTansferingPng &&
              !isTansferingHtml && (
                <Button
                  disabled={isTansferingMd}
                  data-type="markdown"
                  onClick={onTranslateFormatOfMd}
                  className="w-[100px] mr-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-600 px-2"
                >
                  {isTansferingMd ? t('transition') : "Markdown"}
                </Button>
              )}
            {!isTansferingMd &&
              !isTansferingJpg &&
              !isTansferingPng &&
              !isTansferingHtml && (
                <Button
                  disabled={isTansferingDocx}
                  data-type="docx"
                  onClick={onTranslateFormatOfDocx}
                  className="w-[100px] mr-6 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600"
                >
                  {isTansferingDocx ? t('transition') : "DOCX"}
                </Button>
              )}
            {!isTansferingMd &&
              !isTansferingDocx &&
              !isTansferingPng &&
              !isTansferingHtml && (
                <Button
                  disabled={isTansferingJpg}
                  data-type="jpg"
                  onClick={onTranslateFormatOfJpg}
                  className="w-[100px] mr-6 bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-700"
                >
                  {isTansferingJpg ? t('transition') : "JPEG"}
                </Button>
              )}
            {!isTansferingMd &&
              !isTansferingDocx &&
              !isTansferingJpg &&
              !isTansferingHtml && (
                <Button
                  disabled={isTansferingPng}
                  data-type="png"
                  onClick={onTranslateFormatOfPng}
                  className="w-[100px] mr-6 bg-green-600 hover:bg-green-700 active:bg-green-700"
                >
                  {isTansferingPng ? t('transition') : "PNG"}
                </Button>
              )}
            {(isTansferingMd ||
              isTansferingDocx ||
              isTansferingJpg ||
              isTansferingPng ||
              isTansferingHtml) && (
                <div className="text-sm text-center text-slate-400 leading-9">
                  {t('app.uploadPrompt')}
                </div>
              )}
          </div>
        )}
      </div>
      <div className="file_container">
        <iframe
          allowFullScreen
          src={props.originURL}
          className={cn(
            isMobile ? "iframe_difff_width" : "iframe_width",
            "max-w-[1240px]",
            props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
          )}
        ></iframe>
      </div>
      {isMobile && (
        <div className="w-full flex flex-col justify-center">
          {!isTansferingMd &&
            !isTansferingDocx &&
            !isTansferingJpg &&
            !isTansferingPng && (
              <Button
                disabled={isTansferingHtml}
                data-type="markdown"
                onClick={onTranslateFormatOfHtml}
                className="w-full mt-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-600"
              >
                {isTansferingHtml ? t('transition') : "HTML"}
              </Button>
            )}
          {!isTansferingDocx &&
            !isTansferingJpg &&
            !isTansferingPng &&
            !isTansferingHtml && (
              <Button
                disabled={isTansferingMd}
                data-type="markdown"
                onClick={onTranslateFormatOfMd}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-600"
              >
                {isTansferingMd ? t('transition') : "Markdown"}
              </Button>
            )}
          {!isTansferingMd &&
            !isTansferingJpg &&
            !isTansferingPng &&
            !isTansferingHtml && (
              <Button
                disabled={isTansferingDocx}
                data-type="docx"
                onClick={onTranslateFormatOfDocx}
                className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600"
              >
                {isTansferingDocx ? t('transition') : "DOCX"}
              </Button>
            )}
          {!isTansferingMd &&
            !isTansferingDocx &&
            !isTansferingPng &&
            !isTansferingHtml && (
              <Button
                disabled={isTansferingJpg}
                data-type="jpg"
                onClick={onTranslateFormatOfJpg}
                className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-700"
              >
                {isTansferingJpg ? t('transition') : "JPEG"}
              </Button>
            )}
          {!isTansferingMd &&
            !isTansferingDocx &&
            !isTansferingJpg &&
            !isTansferingHtml && (
              <Button
                disabled={isTansferingPng}
                data-type="png"
                onClick={onTranslateFormatOfPng}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 active:bg-green-700"
              >
                {isTansferingPng ? t('transition') : "PNG"}
              </Button>
            )}
          {(isTansferingMd ||
            isTansferingDocx ||
            isTansferingJpg ||
            isTansferingPng ||
            isTansferingHtml) && (
              <div className="text-sm text-center text-slate-400 leading-9">
                {t('transition')}
              </div>
            )}
        </div>
      )}
    </div>
  );
}
