import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "../utils";
import { useTranslation } from "react-i18next";

export default function TranslateComp({
  transalteURL,
  originURL,
  onBackHandle,
  isHeightOfA4
}: any) {
  const { t } = useTranslation()
  const [tabType, setTabType] = useState("1");
  const [isDownload, setIsDownload] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const onReturnHandle = () => {
    onBackHandle("translate");
  };

  function setIsShowDiffPDF() {
    const isShowDiff = window.innerWidth <= 768 ? false : true;
    setIsMobile(isShowDiff);
    if (!isShowDiff) {
      setTabType("2");
    }
  }

  useEffect(() => {
    window.onresize = function () {
      setIsShowDiffPDF();
    };
    setIsShowDiffPDF();
    return () => {
      window.onresize = null;
    };
  }, []);

  return (
    <Tabs
      defaultValue={tabType}
      value={tabType}
      onValueChange={(val) => {
        setTabType(val);
      }}
      className="py-[30px] box-border flex flex-col items-center flex-1"
    >
      <div className={cn("w-full flex justify-between items-center", !isMobile ? 'flex-col' : "")}>
        {isDownload && (
          <Button
            onClick={onReturnHandle}
            className="btnLayout outline-1 my-[12px] text-[14px] outline bg-transparent rounded-md hover:bg-transparent font-medium text-gray-400 px-10 box-border"
          >
            {t('return')}
          </Button>
        )}
        {!isDownload && (
          <Dialog>
            <DialogTrigger className="btnLayout my-[12px] py-2 text-[14px] block text-nowrap outline-1 outline bg-transparent rounded-md hover:bg-transparent font-medium text-gray-400 px-10 box-border">
              {t('return')}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <span className="text-[20px]">{t('tips')}</span>
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {t('noDownloadedFiles')}
                </DialogDescription>
                <div className="text-right">
                  <Button
                    size="sm"
                    onClick={onReturnHandle}
                    className="relative right-0 outline-1 outline bg-violet-500 rounded-md hover:bg-violet-600 font-medium px-[10px] box-border w-[100px]"
                  >
                    {t('exit')}
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
        {!isMobile && (
          <Button
            onClick={() => {
              window.open(transalteURL, "_blank");
              setIsDownload(true);
            }}
            className="btnLayout bg-violet-500 font-medium hover:bg-violet-600 px-10 box-border mb-[12px]"
          >
            {t('downloadFile')}
          </Button>
        )}
        <TabsList className="w-[50%] h-[40px]">
          <TabsTrigger className="flex-1 h-full" value="0">
            {t('app.original')}
          </TabsTrigger>
          {isMobile && (
            <TabsTrigger className="flex-1 h-full" value="1">
              {t('contrast')}
            </TabsTrigger>
          )}
          <TabsTrigger className="flex-1 h-full" value="2">
            {t('result')}
          </TabsTrigger>
        </TabsList>
        {isMobile && (
          <Button
            onClick={() => {
              window.open(transalteURL, "_blank");
              setIsDownload(true);
            }}
            className="btnLayout bg-violet-500 font-medium hover:bg-violet-600 px-10 box-border"
          >
            {t('downloadFile')}
          </Button>
        )}
      </div>
      <div id="content" className="h-full mt-[20px] overflow-hidden">
        <TabsContent value="0" className="h-full mt-0">
          {/* <div> */}
          <div className="rounded-lg overflow-hidden border-2 box-border border-dashed border-slate-300">
            <iframe
              allowFullScreen
              src={originURL}
              className={cn(
                "iframe_width max-w-[1240px]",
                isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
              )}
            ></iframe>
          </div>
          {/* <FilePDF fileUrl={originURL} /> */}
          {/* </div> */}
        </TabsContent>
        {isMobile && (
          <TabsContent value="1" className="h-full mt-0">
            <div className="flex justify-between">
              {/* <div className="w-[50%] mr-[10px]">
                <FilePDF fileUrl={originURL} name="origin" />
              </div> */}
              <div className="box-border overflow-hidden mr-[30px] items-center rounded-lg border-2 border-dashed border-slate-300">
                <iframe
                  allowFullScreen
                  src={originURL}
                  className={cn(
                    "iframe_diff_width max-w-[1240px]",
                    isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                  )}
                ></iframe>
              </div>
              <div className="box-border items-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300">
                <iframe
                  allowFullScreen
                  className={cn(
                    "iframe_diff_width max-w-[1240px]",
                    isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                  )}
                  src={transalteURL}
                ></iframe>
              </div>
            </div>
          </TabsContent>
        )}
        <TabsContent value="2" className="h-full mt-0">
          <div className="box-border overflow-hidden rounded-lg border-2 border-dashed border-slate-300">
            <iframe
              allowFullScreen
              src={transalteURL}
              className={cn(
                "iframe_width max-w-[1240px]",
                isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
              )}
            ></iframe>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
