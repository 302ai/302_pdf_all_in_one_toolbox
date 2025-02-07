import { useState, useEffect } from "react";
import { cn, onDownloadHandle } from "./../utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ReturnComp from "./ReturnBtn";
import { marked } from "marked";
import { Button } from "./ui/button";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/hooks";
import { selectGlobal } from "../store/globalSlice";
import { useTranslation } from "react-i18next";

type props = {
  uuid: string;
  upload_url: string;
  orcData: [] | undefined;
  fileUrl: string;
  isHeightOfA4: boolean;
  exctracting: boolean;
  onBackHandle: Function;
  fileName: string;
  language: string | undefined;
};
const apiKey = import.meta.env.VITE_APP_API_KEY;
export default function ContentExtract(props: props) {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false);
  const [tabType, setTabType] = useState("1");
  const [orcResult, setOrcResult] = useState<string[] | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const globalState = useAppSelector(selectGlobal);

  const setIsShowDiffPDF = () => {
    const flag = window.innerWidth <= 768 ? true : false;
    setIsMobile(flag);
  };

  useEffect(() => {
    const arr = props.orcData?.map((item: { md: string }): string => {
      if (!item.md) {
        return "";
      }
      return marked.parse(item.md) as string;
    });
    setOrcResult(arr);
    window.onresize = function () {
      setIsShowDiffPDF();
    };
    setIsShowDiffPDF();
    return () => {
      window.onresize = null;
    };
  }, []);

  const onCopyHandle = () => {
    const content = props.orcData
      ?.map((item: { md: string }) => item.md)
      .join("") as string;
    copy(content);
    toast.success(t('copySuccessful'), {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const onExportHandle = (e: any) => {
    const type = e.target.dataset.type;
    let filename: string;
    if (type === "html") {
      const blob = new Blob(orcResult);
      const name = props.fileName.split(".")[0] + ".html";
      onDownloadHandle(blob, name);
    } else if (type === "docx") {
      setIsExporting(true);
      fetch("/api/v1/file/convert", {
        method: "post",
        body: JSON.stringify({
          uuid: props.uuid,
          upload_url: props.upload_url,
          api_key: apiKey,
          to: "docx",
        }),
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
      })
        .then((response) => {
          const contentDisp = response.headers.get("Content-Disposition");
          const str = contentDisp?.split("'")[2] as string;
          filename = decodeURIComponent(str);
          return response.blob();
        })
        .then((response) => {
          onDownloadHandle(response, filename);
        })
        .catch((error) => {
          toast.error(error.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            theme: "light",
            closeButton: false,
          });
        })
        .finally(() => {
          setIsExporting(false);
        });
    }
  };

  return (
    <div className="pb-[30px] flex flex-col items-center flex-1">
      {isMobile && (
        <>
          <Tabs
            defaultValue={tabType}
            value={tabType}
            onValueChange={(val: string) => {
              setTabType(val);
            }}
            className="box-border flex flex-col items-center flex-1"
          >
            <div className="w-full mt-[30px] flex justify-between">
              <ReturnComp
                type="exctract"
                language={globalState.language}
                onReturnHandle={props.onBackHandle}
                disabled={props.exctracting}
              />
              <TabsList className="h-[40px]">
                <TabsTrigger className="flex-1 h-full" value="0">
                  {t('file')}
                </TabsTrigger>
                <TabsTrigger className="flex-1 h-full" value="1">
                  {t('dialogue')}
                </TabsTrigger>
              </TabsList>
            </div>
            <div id="content" className="h-full overflow-hidden mt-[20px]">
              <TabsContent value="0" className="h-full mt-0">
                <div className="file_container">
                  <iframe
                    allowFullScreen
                    src={props.fileUrl}
                    className={cn(
                      "iframe_width max-w-[1240px]",
                      props.isHeightOfA4
                        ? "iframe_aspect-ratio"
                        : "iframe_height"
                    )}
                  ></iframe>
                </div>
              </TabsContent>
              <TabsContent value="1" className="h-full mt-0">
                <div
                  style={{
                    overflowY: "auto",
                  }}
                  className={cn(
                    "file_container relative iframe_width max-w-[1240px] scroll h-full p-2",
                    props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                  )}
                >
                  {orcResult &&
                    orcResult.map((item, index) => {
                      return (
                        <div
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html: item,
                          }}
                        ></div>
                      );
                    })}
                </div>
              </TabsContent>
            </div>
          </Tabs>
          <div className="w-full flex flex-col pt-4">
            <Button
              className="bg-green-500 hover:bg-green-600 active:bg-green-600 px-4"
              onClick={onCopyHandle}
              disabled={isExporting}
            >
              {t('copy')}
            </Button>
            <Button
              data-type="docx"
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-600 px-4 my-4"
              onClick={onExportHandle}
              disabled={isExporting}
            >
              {isExporting
                ? t('exporting')
                : t('exportDocxFormat')}
            </Button>
            <Button
              data-type="html"
              className="bg-orange-500 hover:bg-orange-600 active:bg-orange-600 px-4"
              onClick={onExportHandle}
              disabled={isExporting}
            >
              {t('exportHtmlFormat')}
            </Button>
          </div>
        </>
      )}
      {!isMobile && (
        <>
          <div className="w-full my-[30px] flex justify-between">
            <ReturnComp
              language={globalState.language}
              type="exctract"
              onReturnHandle={props.onBackHandle}
              disabled={props.exctracting}
            />
            <div>
              <Button
                className="bg-green-500 hover:bg-green-600 active:bg-green-600 px-4 mr-4"
                onClick={onCopyHandle}
                disabled={isExporting}
              >
                {t('copy')}
              </Button>
              <Button
                data-type="docx"
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-600 px-4 mr-4"
                onClick={onExportHandle}
                disabled={isExporting}
              >
                {isExporting
                  ? t('exporting')
                  : t('exportDocxFormat')}
              </Button>
              <Button
                data-type="html"
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-600 px-4"
                onClick={onExportHandle}
                disabled={isExporting}
              >
                {t('exportHtmlFormat')}
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="file_container mr-[20px]">
              <iframe
                allowFullScreen
                src={props.fileUrl}
                className={cn(
                  "iframe_diff_width max-w-[1240px]",
                  props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                )}
              ></iframe>
            </div>
            <div
              className={cn(
                "file_container iframe_diff_width max-w-[1240px] relative scroll p-2",
                props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
              )}
              style={{
                overflowY: "auto",
              }}
            >
              {orcResult &&
                orcResult.map((item, index) => {
                  return (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{
                        __html: item,
                      }}
                    ></div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
