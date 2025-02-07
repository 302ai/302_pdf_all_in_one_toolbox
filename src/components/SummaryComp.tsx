import { useState, useEffect } from "react";
import { cn } from "../utils";
import { Spinner, Theme } from "@radix-ui/themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ReturnComp from "./ReturnBtn";
import { useAppSelector } from "./../store/hooks";
import { selectGlobal } from "./../store/globalSlice";
import { useTranslation } from "react-i18next";

type props = {
  summary:
  | {
    history: string[];
    progress: number;
  }
  | undefined;
  summarying: boolean;
  uploadUrl: string;
  isHeightOfA4: boolean;
  summaryErr: string | undefined;
  onGenerateSummaryHandle: Function;
  onResetSummaryInfoHandle: Function;
  onBackHandle: Function;
  language: string | undefined;
};

export default function SummaryComp(props: props) {
  const { t } = useTranslation()

  const [isMobile, setIsMobile] = useState(false);
  const [tabType, setTabType] = useState("0");
  const global = useAppSelector(selectGlobal);

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

  return (
    <div className="pb-[30px] flex flex-col items-center flex-1">
      {isMobile && (
        <Tabs
          defaultValue={tabType}
          value={tabType}
          onValueChange={(val) => {
            setTabType(val);
          }}
          className="box-border flex flex-col items-center flex-1"
        >
          <div className="w-full mt-[30px] flex justify-between">
            <ReturnComp
              language={global.language}
              type="summary"
              onReturnHandle={props.onBackHandle}
              disabled={props.summarying}
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
          <div id="content" className="h-full mt-[20px] overflow-hidden">
            <TabsContent value="0" className="h-full mt-0">
              <div className="file_container">
                <iframe
                  allowFullScreen
                  src={props.uploadUrl}
                  className={cn(
                    "iframe_width max-w-[1240px]",
                    props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                  )}
                ></iframe>
              </div>
            </TabsContent>
            <TabsContent value="1" className="h-full mt-0">
              <div className="file_container relative">
                <div className={cn("iframe_width max-w-[1240px]")}>
                  {props.summary || props.summarying || props.summaryErr ? (
                    <div
                      id="summary"
                      className={cn(
                        "text-base p-2 pt-1 overflow-y-auto scroll h-full",
                        props.isHeightOfA4
                          ? "iframe_aspect-ratio"
                          : "iframe_height"
                      )}
                    >
                      {props.summary?.history.map((history) => (
                        <div
                          key={history}
                          className="my-1 p-2 rounded-md"
                          style={{
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #dedede",
                          }}
                        >
                          {history
                            .replace("user_say-", "")
                            .replace("gpt_say-", "")}
                        </div>
                      ))}
                      {props.summarying && (
                        <Theme
                          className="my-1 p-2 flex gap-2 items-center rounded-md"
                          style={{
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #dedede",
                          }}
                        >
                          <div style={{ color: "#383838" }}>
                            {t('FullTextSummaryProgress')} {props.summary?.progress || 0} %
                          </div>
                          <Spinner />
                        </Theme>
                      )}
                      {props.summaryErr && true && (
                        <div
                          className="my-1 p-2 flex gap-2 rounded-md"
                          style={{
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #dedede",
                            color: "#383838",
                          }}
                        >
                          {props.summaryErr}
                          <div>
                            {" "}
                            {t('or')}{" "}
                            <span
                              className="underline cursor-pointer"
                              onClick={() => {
                                props.onResetSummaryInfoHandle();
                                props.onGenerateSummaryHandle();
                              }}
                              style={{ color: "#383838" }}
                            >
                              {t('ttemptGenerateFullTextSummaryAgain')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center cursor-pointer px-14 py-10 rounded-2xl"
                      style={{ backgroundColor: "rgb(208 208 208 / 30%)" }}
                      onClick={() => {
                        props.onGenerateSummaryHandle();
                      }}
                    >
                      <svg
                        width="55"
                        height="55"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
                          fill="#8c8f95"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <div
                        className="text-lg font-bold text-center"
                        style={{ color: "#8c8f95" }}
                      >
                        {t('enerateFullTextAbstract')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}
      {!isMobile && (
        <>
          <div className="w-full my-[30px] flex">
            <ReturnComp
              language={global.language}
              type="summary"
              onReturnHandle={props.onBackHandle}
              disabled={props.summarying}
            />
          </div>
          <div className="flex justify-between">
            <div className="file_container mr-[20px]">
              <iframe
                allowFullScreen
                src={props.uploadUrl}
                className={cn(
                  "iframe_diff_width max-w-[1240px]",
                  props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                )}
              ></iframe>
            </div>
            <div className="file_container relative">
              <div className={cn("iframe_diff_width max-w-[1240px]")}>
                {props.summary || props.summarying || props.summaryErr ? (
                  <div
                    id="summary"
                    className={cn(
                      "text-base p-2 pt-1 overflow-y-auto scroll h-full",
                      props.isHeightOfA4
                        ? "iframe_aspect-ratio"
                        : "iframe_height"
                    )}
                  >
                    {props.summary?.history.map((history) => (
                      <div
                        key={history}
                        className="my-1 p-2 rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                        }}
                      >
                        {history
                          .replace("user_say-", "")
                          .replace("gpt_say-", "")}
                      </div>
                    ))}
                    {props.summarying && (
                      <Theme
                        className="my-1 p-2 flex gap-2 items-center rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                        }}
                      >
                        <div style={{ color: "#383838" }}>
                          {t('FullTextSummaryProgress')} {props.summary?.progress || 0} %
                        </div>
                        <Spinner />
                      </Theme>
                    )}
                    {props.summaryErr && (
                      <div
                        className="my-1 p-2 flex flex-col justify-center items-center gap-2 rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                          color: "#383838",
                        }}
                      >
                        <div style={{ color: 'rgb(212, 14, 14)' }} dangerouslySetInnerHTML={{ __html: props.summaryErr }} />
                        {t('or')}
                        <span
                          className="underline cursor-pointer text-[#006dff]"
                          onClick={() => {
                            props.onResetSummaryInfoHandle();
                            props.onGenerateSummaryHandle();
                          }}
                        >
                          {t('ttemptGenerateFullTextSummaryAgain')}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center cursor-pointer px-14 py-10 rounded-2xl"
                    style={{ backgroundColor: "rgb(208 208 208 / 30%)" }}
                    onClick={() => {
                      props.onGenerateSummaryHandle();
                    }}
                  >
                    <svg
                      width="55"
                      height="55"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
                        fill="#8c8f95"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div
                      className="text-lg font-bold text-center"
                      style={{ color: "#8c8f95" }}
                    >
                      {t('enerateFullTextAbstract')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
