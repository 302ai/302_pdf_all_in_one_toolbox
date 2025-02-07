import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Spinner, Theme } from "@radix-ui/themes";
import { cn } from "./../utils";
import { useAppSelector } from "./../store/hooks";
import { selectGlobal } from "./../store/globalSlice";
import SpinnerComp from "./SpinnerComp";
import ReturnComp from "./ReturnBtn";
import { useTranslation } from "react-i18next";
import { ErrorToast } from "./errorToast";

type props = {
  uploadUrl: string;
  language: string | undefined;
  isHeightOfA4: boolean;
  queryInfo:
  | {
    history: string[];
    progress: number;
  }
  | undefined;
  querying: boolean;
  parsedPaper: boolean;
  parsingPaper: boolean;
  parseErr: string | undefined;
  onParsePDFHandle: Function;
  onBackHandle: Function;
  query: string;
  onAnswerQuestion: Function;
  onSendMessage: Function;
  onChange: Function;
};

export default function AnswerComp(props: props) {
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
          onValueChange={(val: string) => {
            setTabType(val);
          }}
          className="box-border flex flex-col items-center flex-1"
        >
          <div className="w-full mt-[30px] flex justify-between">
            <ReturnComp
              type="answer"
              language={global.language}
              onReturnHandle={props.onBackHandle}
              disabled={props.parsingPaper || props.querying}
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
              <div className="file_container relative p-1 box-border">
                <div
                  id="answer"
                  className={cn(
                    "iframe_width max-w-[1240px] overflow-y-auto scroll",
                    props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                  )}
                >
                  {props.queryInfo?.history.map((history) => (
                    <>
                      {history.indexOf("query-user_say-") === -1 && (
                        <>
                          {history.indexOf("err_code-") === -1 && (
                            <div
                              key={history}
                              className="flex items-start gap-2"
                            // style={{
                            //   width: queryWidth ? queryWidth : undefined,
                            // }}
                            >
                              <img
                                src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                                width={30}
                                height={30}
                                className="object-contain mt-2"
                              />
                              <div
                                key={history}
                                className="my-1 p-2 rounded-md"
                                style={{
                                  backgroundColor: "#f5f5f5",
                                  border: "1px solid #dedede",
                                  wordWrap: "break-word",
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: history
                                    .replace("query-", "")
                                    .replace("gpt_say-", "")
                                    .replace("user_say-", ""),
                                }}
                              ></div>
                            </div>
                          )}
                          {history.indexOf("err_code-") > -1 && (
                            <>
                              <div
                                key={history}
                                className="flex items-start gap-2"
                              >
                                <img
                                  src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                                  width={30}
                                  height={30}
                                  className="object-contain mt-2"
                                />
                                <div
                                  key={history}
                                  className="my-1 p-2 rounded-md"
                                  style={{
                                    backgroundColor: "#ffe9f0",
                                    border: "0.8px solid #ffe9f0",
                                    color: "#d13372",
                                  }}
                                >
                                  <ErrorToast code={+history}/>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      {history.indexOf("query-user_say-") > -1 && (
                        <div className="flex justify-end">
                          <div
                            key={history}
                            className="my-1 p-2 inline-block rounded-md"
                            style={{
                              backgroundColor: "#e6f4fe",
                              border: "1px solid #e6f4fe",
                              color: "#006dcbf2",
                            }}
                          >
                            {history.replace("query-user_say-", "")}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                  {props.parsingPaper && (
                    <div className="flex items-start gap-2">
                      <img
                        src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                        width={30}
                        height={30}
                        className="object-contain mt-2"
                      />
                      <Theme
                        className="my-1 p-2 flex gap-2 items-center rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                        }}
                      >
                        <div style={{ color: "#383838" }}>
                          {t('theParsingProgressIs')} {props.queryInfo?.progress || 0} %
                        </div>
                        <Spinner />
                      </Theme>
                    </div>
                  )}
                  {props.parseErr && (
                    <div className="flex items-start gap-2">
                      <img
                        src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                        width={30}
                        height={30}
                        className="object-contain mt-2"
                      />
                      <div
                        className="my-1 p-2 flex gap-2 items-center cursor-pointer rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                          color: "#383838",
                        }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: props.parseErr,
                          }}
                        ></span>
                        <div>
                          {/* 或{" "}
                          <span
                            onClick={() => {
                              // setParseErr(undefined);
                              // setQueryInfo(undefined);
                              // parsePaper();
                            }}
                            className="underline font-bold"
                            style={{ color: "#383838" }}
                          >
                            重新AI解析论文
                          </span> */}
                        </div>
                      </div>
                    </div>
                  )}
                  {props.querying && (
                    <div className="flex items-start gap-2">
                      <img
                        src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                        width={30}
                        height={30}
                        className="object-contain mt-2"
                      />
                      <div
                        className="my-1 p-2 w-20 flex justify-center rounded-md"
                        style={{
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #dedede",
                        }}
                      >
                        <SpinnerComp />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex mt-2 ">
                  <Input
                    onKeyDown={(e) => {
                      if (e.keyCode !== 13) {
                        return;
                      }
                      props.onSendMessage();
                    }}
                    disabled={!props.parsedPaper || props.querying}
                    value={props.query}
                    placeholder={ t('askAQuestion')}
                    onChange={(e) => props.onChange(e.target.value)}
                    className="bg-white mr-1"
                  />
                  <Button
                    id="query-button-desktop"
                    onClick={() => {
                      props.onSendMessage();
                    }}
                    className="bg-violet-500 hover:bg-violet-600 active:bg-violet-600"
                    disabled={!props.parsedPaper || !props.query}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      )}
      {!isMobile && (
        <>
          <div className="w-full my-[30px]">
            <ReturnComp
              language={global.language}
              type="answer"
              onReturnHandle={props.onBackHandle}
              disabled={props.parsingPaper || props.querying}
            />
          </div>
          <div className="flex justify-between">
            <div className="file_container mr-[20px]">
              <iframe
                allowFullScreen
                src={props.uploadUrl}
                className={cn(
                  "iframe_diff_width max-w-[1240px] h-full",
                  props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                )}
              ></iframe>
            </div>
            <div className="file_container relative p-1 box-border">
              <div
                id="answer"
                className={cn(
                  "iframe_diff_width max-w-[1240px] overflow-y-auto scroll",
                  props.isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                )}
              >
                {props.queryInfo?.history.map((history) => (
                  <>
                    {history.indexOf("query-user_say-") === -1 && (
                      <>
                        {history.indexOf("err_code-") === -1 && (
                          <div
                            key={history}
                            className="flex items-start gap-2"
                          // style={{
                          //   width: queryWidth ? queryWidth : undefined,
                          // }}
                          >
                            <img
                              src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                              width={30}
                              height={30}
                              className="object-contain mt-2"
                            />
                            <div
                              key={history}
                              className="my-1 p-2 rounded-md"
                              style={{
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #dedede",
                                wordWrap: "break-word",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: history
                                  .replace("query-", "")
                                  .replace("gpt_say-", "")
                                  .replace("user_say-", ""),
                              }}
                            ></div>
                          </div>
                        )}
                        {history.indexOf("err_code-") > -1 && (
                          <>
                            <div key={history} className="flex items-start gap-2">
                              <img
                                src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                                width={30}
                                height={30}
                                className="object-contain mt-2"
                              />
                              <div
                                key={history}
                                className="my-1 p-2 rounded-md"
                                style={{
                                  backgroundColor: "#ffe9f0",
                                  border: "0.8px solid #ffe9f0",
                                  color: "#d13372",
                                }}
                              >
                                <ErrorToast code={+history}/>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {history.indexOf("query-user_say-") > -1 && (
                      <div className="flex justify-end">
                        <div
                          key={history}
                          className="my-1 p-2 inline-block rounded-md"
                          style={{
                            backgroundColor: "#e6f4fe",
                            border: "1px solid #e6f4fe",
                            color: "#006dcbf2",
                          }}
                        >
                          {history.replace("query-user_say-", "")}
                        </div>
                      </div>
                    )}
                  </>
                ))}
                {props.parsingPaper && (
                  <div className="flex items-start gap-2">
                    <img
                      src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                      width={30}
                      height={30}
                      className="object-contain mt-2"
                    />
                    <Theme
                      className="my-1 p-2 flex gap-2 items-center rounded-md"
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #dedede",
                      }}
                    >
                      <div style={{ color: "#383838" }}>
                        {t('theParsingProgressIs')} {props.queryInfo?.progress || 0} %
                      </div>
                      <Spinner />
                    </Theme>
                  </div>
                )}
                {props.parseErr && (
                  <div className="flex items-start gap-2">
                    <img
                      src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                      width={30}
                      height={30}
                      className="object-contain mt-2"
                    />
                    <div
                      className="my-1 p-2 flex gap-2 items-center cursor-pointer rounded-md"
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #dedede",
                        color: "#383838",
                      }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: props.parseErr,
                        }}
                      ></span>
                      {/* 或{" "}
                      <span
                        onClick={() => {
                          // setParseErr(undefined);
                          // setQueryInfo(undefined);
                          // parsePaper();
                        }}
                        className="underline font-bold"
                        style={{ color: "#383838" }}
                      >
                        重新AI解析论文
                      </span> */}
                    </div>
                  </div>
                )}
                {props.querying && (
                  <div className="flex items-start gap-2">
                    <img
                      src="https://file.302.ai/gpt/imgs/5b36b96aaa052387fb3ccec2a063fe1e.png"
                      width={30}
                      height={30}
                      className="object-contain mt-2"
                    />
                    <div
                      className="my-1 p-2 w-20 flex justify-center rounded-md"
                      style={{
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #dedede",
                      }}
                    >
                      <SpinnerComp />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex mt-2 ">
                <Input
                  onKeyDown={(e) => {
                    if (e.keyCode !== 13) {
                      return;
                    }
                    props.onSendMessage();
                  }}
                  disabled={!props.parsedPaper || props.querying}
                  value={props.query}
                  onChange={(e) => props.onChange(e.target.value)}
                  className="bg-white mr-1"
                  placeholder={t('askAQuestion')}
                />
                <Button
                  id="query-button-desktop"
                  onClick={() => {
                    props.onSendMessage();
                  }}
                  className="bg-violet-500 hover:bg-violet-600 active:bg-violet-600"
                  disabled={!props.parsedPaper || !props.query}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
