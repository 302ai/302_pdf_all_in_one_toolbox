import React, { useCallback, useState, useEffect } from "react";
import Header from "./components/Header";
import PoweredBy from "./components/PoweredBy";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "@radix-ui/themes";
import { selectGlobal, setGlobalState } from "./store/globalSlice";
import TranslateComp from "./components/TranslateComp";
import {cn,isValidJSONObject,} from "./utils";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import { Progress } from "./components/ui/progress";
import UploadComp from "./components/UploadComp";
import moment from "moment";
import { marked } from "marked";
import TransferFormatComp from "./components/TransferFormatComp";
import SummaryComp from "./components/SummaryComp";
import AnswerComp from "./components/AnswerComp";
import ContentExtract from "./components/ContentExtract";
import { Select } from "@radix-ui/themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import TranslateHistoryDialog from "./components/TranslateHistoryDialog";
import { LanguagePopover } from "./components/LanguagePopover";
import { LANG } from "./lib/Language";
import { useTranslation } from "react-i18next";
import { ErrorToast } from "./components/errorToast";
import ReactDOMServer from 'react-dom/server';

const apiKey = import.meta.env.VITE_APP_API_KEY;
const hideBrand = import.meta.env.VITE_APP_SHOW_BRAND === 'true';
const modelName = import.meta.env.VITE_APP_MODEL_NAME;

function App() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch();
  const [tabType, setTabType] = useState("1");
  const [language, setLanguage] = useState<string>("Chinese");
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");
  const [PDFUrl, setPDFUrl] = useState("");
  const [translatePdfUrl, setTranslatePdfUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [summarying, setSummarying] = useState(false);
  const [query, setQuery] = useState("");
  const [querying, setQuerying] = useState(false);
  const [parsedPaper, setParsedPaper] = useState(false);
  const [parsingPaper, setParsingPaper] = useState(false);
  const [parseTaskId, setParseTaskId] = useState("");
  const [progress, setProgress] = React.useState(0);
  const [progressDesc, setProgressDesc] = useState("");
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [isHeightOfA4, setIsHeightOfA4] = useState(true);
  const [summaryErr, setSummaryErr] = useState<string>("");
  const [parseErr, setParseErr] = useState<string>("");

  const [summarySuccess, setSummarySuccess] = useState(false);
  const [answerSuccess, setAnswerSuccess] = useState(false);
  const [exctractSuccess, setExctractSuccess] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);

  const [exctracting, setExctracting] = useState(false);
  const [isShowTransfer, setIsShowTransfer] = useState(false);

  const [isTranslate, setIsTranslate] = useState(false);

  const [uuid, setUuid] = useState("");

  const [summary, setSummary] = useState<
    | {
      history: string[];
      progress: number;
    }
    | undefined
  >();
  const [queryInfo, setQueryInfo] = useState<
    | {
      history: string[];
      progress: number;
    }
    | undefined
  >();
  const [, setFullTextTranslation] = useState<
    | {
      history: string[];
      progress: number;
    }
    | undefined
  >(undefined);
  const [orcData, setOrcData] = useState<[] | undefined>();

  // 查询任务
  const [taskIntervalId, setTaskInterval] = useState({
    translate: 0,
    summary: 0,
    parse: 0,
    query: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  const global = useAppSelector(selectGlobal);

  function toScrollBottom(
    id: string,
    behavior: "smooth" | "instant" = "smooth"
  ) {
    setTimeout(() => {
      const domId = id === "parse" ? "answer" : id;
      const desktopDom = window.document.getElementById(domId);
      let mobileDom = window.document.getElementById(domId + "-mobile");
      if (domId !== "answer") mobileDom = mobileDom?.parentElement || null;
      desktopDom?.scrollBy({
        top: 99999,
        behavior,
      });
      mobileDom?.scrollBy({
        top: 99999,
        behavior,
      });
    });
  }

  const setIsShowMobile = () => {
    const flag = window.innerWidth <= 768 ? true : false;
    setIsMobile(flag);
  };

  useEffect(() => {
    const translateHistory = JSON.parse(
      localStorage.getItem("translateHistory") || "[]"
    );
    setHistoryList([...translateHistory]);

    window.onresize = () => {
      const height = document.body.clientHeight;
      const flag = height > 1100 ? false : true;
      setIsHeightOfA4(flag);
      setIsShowMobile();
    };

    window.onload = () => {
      const height = document.body.clientHeight;

      if (height > 1100) {
        setIsHeightOfA4(false);
      }
    };

    setIsShowMobile();

    return () => {
      window.onresize = null;
    };
  }, []);

  // 读取当前用户语言
  useEffect(() => {
    const windowLanguage = window.navigator.language;
    let lang: 'zh' | 'en' | 'ja' = 'en';
    if (["en-US", "zh-CN", "ja-JP"].includes(windowLanguage)) {
      // @ts-ignore
      lang = LANG[windowLanguage]
    }
    const localStorageLanguage = localStorage.getItem('lang')
    if (localStorageLanguage) lang = localStorageLanguage as 'zh' | 'en' | 'ja';
    const searchLang = new URLSearchParams(window.location.search).get('lang')
    if (searchLang) {
      // @ts-ignore
      if (["en-US", "zh-CN", "ja-JP"].includes(searchLang)) lang = LANG[searchLang];
      // @ts-ignore
      else if (["en", "zh", "ja"].includes(searchLang)) lang = searchLang
      else lang = 'en'
    }
    localStorage.setItem('lang', lang)
    dispatch(setGlobalState({ language: lang }))
    i18n.changeLanguage(lang)
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: any, fileRejections: any) => {
      setUploading(true);
      const code = fileRejections[0]?.errors[0].code;
      if (code === "file-too-large") {
        toast.error(t('app.FileSizeExceeds'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setUploading(false);
        return;
      }

      const formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);

      try {
        const response = await fetch(`/api/v1/file/upload`, {
          method: "post",
          body: formdata,
          headers: {
            accept: "application/json",
          },
        });
        if (!response.ok) {
          toast.error(response.statusText, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            theme: "light",
            closeButton: false,
          });
          setIsUploadSuccess(false);
          setUploading(false);
          return;
        }

        const txt = await response.text();
        const result = JSON.parse(txt);

        setUploading(false);
        if (!result.data) {
          toast.error(t('app.fileUploadFailed'), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            theme: "light",
            closeButton: false,
          });
          return;
        }
        const upload_url = result.data.upload_url;
        const pdfUrl = result.data["302_upload_url"];
        setUuid("");
        setPDFUrl(pdfUrl);
        setUploadUrl(upload_url);
        setIsUploadSuccess(true);
        setFileName(acceptedFiles[0].name);
      } catch (error: any) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setIsUploadSuccess(false);
        setUploading(false);
      }
    },
    []
  );

  const onChangeIsTranslate = async () => {
    setParseErr("");
    setSummaryErr("");
    setIsTranslate(true);
  };

  const onTranslateHandle = async () => {
    setParseErr("");
    setSummaryErr("");
    setTranslating(true);
    // 处理文件
    fetch(`/api/v1/pdf/translate`, {
      method: "post",
      body: JSON.stringify({
        upload_url: uploadUrl,
        language,
        arxiv_id: "",
        pdf_url: PDFUrl,
        api_key: apiKey,
        models_name: modelName,
        use_cache: false,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((resp) => JSON.parse(resp))
      .then((result) => {
        if (result.data.err_code) {
          setTranslating(false);
          toast.error(<ErrorToast code={result.data.err_code} />)
          return;
        }
        const task_id = result.data.task_id;
        const timestamp = Date.now();
        const translateDate = moment(timestamp).format("MM-DD HH:mm");
        getTaskInfo(task_id, "translate", translateDate);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setTranslating(false);
      });
  };

  const getTaskInfo = (
    taskId: string,
    type: "translate" | "summary" | "parse" | "query",
    translateDate?: string
  ) => {
    if (taskIntervalId[type]) clearInterval(taskIntervalId[type]);
    const taskIntervalIdTemp = taskIntervalId;
    let intervalTime = 2000;
    if (type === "translate" || type === "parse") intervalTime = 6000;
    else if (type === "summary") intervalTime = 4000;
    const intervalId = setInterval(() => {
      setTaskInterval({
        ...taskIntervalIdTemp,
        [type]: intervalId,
      });
      fetch("/api/v1/tasks/" + taskId, {
        method: "get",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.text())
        .then((res) => JSON.parse(res))
        .then((res) => {
          if (res.data.progress === -1) {
            if (type === "summary") setSummarying(false);
            else if (type === "parse") setParsingPaper(false);
            else if (type === "translate") {
              setTranslating(false);
              if (
                res.data.msg?.error_code ||
                res.data.msg?.err_code ||
                res.data.msg?.code
              ) {
                toast.error(<ErrorToast code={res.data.msg.error_code || res.data.msg.err_code || +res.data.msg?.code} />)
                setProgressDesc("");
              } else {
                toast.error(res.data.msg.message)
                setProgressDesc("");
                setFullTextTranslation({
                  history: res.data.history,
                  progress: res.data.progress || 0,
                });
              }
            }

            // 接口报错
            if (
              res.data.msg?.error_code ||
              res.data.msg?.err_code ||
              res.data.msg?.code
            ) {
              if (type === "summary") {
                setSummaryErr(
                  ReactDOMServer.renderToString(<ErrorToast code={res.data.msg.error_code || res.data.msg.err_code || +res.data.msg?.code} />)
                );
              } else if (type === "parse") {
                setParseErr(
                  ReactDOMServer.renderToString(<ErrorToast code={res.data.msg.error_code || res.data.msg.err_code || +res.data.msg?.code} />)
                );
              }
            }
            clearInterval(intervalId);
            return;
          }
          const data = {
            history: res.data.history,
            progress: res.data.progress || 0,
          };
          if (type === "summary") setSummary(data);
          else if (type === "translate") {
            const desc = res.data.history[res.data.history.length - 1];
            setProgressDesc(desc);
            setProgress(res.data.progress || 0);
            setFullTextTranslation(data);
            for (let i = res.data.history.length - 1; i >= 0; i--) {
              if (
                res.data.history[i].indexOf("merge_translate_zh_pdf_url-") > -1
              ) {
                const pdfUrl = res.data.history[i].split(
                  "merge_translate_zh_pdf_url-"
                )[1];
                setTranslatePdfUrl(pdfUrl);
                const translateHistoryItem = {
                  name: fileName,
                  url: pdfUrl,
                  translateDate,
                  id: historyList.length + 1,
                  language
                };
                const historys = [translateHistoryItem, ...historyList];
                localStorage.setItem(
                  "translateHistory",
                  JSON.stringify(historys)
                );
                setHistoryList(historys);
                break;
              }
            }
          } else if (type === "parse") {
            setQueryInfo({
              ...data,
              history: res.data.history.filter(
                (history: string) => history.indexOf("user_say") === -1
              ),
            });
          }

          if (res.data.progress === 100) {
            if (type === "summary") setSummarying(false);
            if (type === "translate") {
              setTranslating(false);
              setProgress(0);
              setTranslateSuccess(true);
            }
            if (type === "parse") {
              setParseTaskId(taskId);
              setParsedPaper(true);
              setParsingPaper(false);
            }
            clearInterval(intervalId);
          }
          if (type !== "translate") {
            toScrollBottom(type);
          }
        });
    }, intervalTime);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 50 * 1024 * 1024, // 50mb
    maxFiles: 1,
    multiple: false,
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const onRenewUploadHandle = useCallback(
    async (acceptedFiles: any, fileRejections: any) => {
      setUploading(true);
      const code = fileRejections[0]?.errors[0].code;
      if (code === "file-too-large") {
        toast.error(t('app.FileSizeExceeds'), {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setUploading(false);
        return;
      }

      const formdata = new FormData();
      formdata.append("file", acceptedFiles[0]);

      try {
        const response = await fetch(`/api/v1/file/upload`, {
          method: "post",
          body: formdata,
          headers: {
            accept: "application/json",
          },
        });
        if (!response.ok) {
          toast.error(response.statusText, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            theme: "light",
            closeButton: false,
          });
          setUploading(false);
          return;
        }

        const txt = await response.text();
        const result = JSON.parse(txt);

        setUploading(false);
        if (!result.data) {
          toast.error(t('app.fileUploadFailed'), {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            pauseOnHover: true,
            theme: "light",
            closeButton: false,
          });
          return;
        }
        const upload_url = result.data.upload_url;
        const pdfUrl = result.data["302_upload_url"];
        setTranslatePdfUrl("");
        setSummary(undefined);
        setQueryInfo(undefined);
        setOrcData(undefined);
        setIsTranslate(false);
        setParseErr("");
        setSummaryErr("");
        setProgressDesc("");
        setUuid("");
        setPDFUrl(pdfUrl);
        setUploadUrl(upload_url);
        setFileName(acceptedFiles[0].name);
      } catch (error: any) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setUploading(false);
      }
    },
    []
  );

  const onGenerateSummary = async () => {
    setParseErr("");
    setSummaryErr("");
    setIsTranslate(false);
    if (summary?.history.length) {
      setSummarySuccess(true);
      return;
    }
    setSummarying(true);
    const summaryResp = await fetch("/api/v1/arxiv/abstract", {
      method: "post",
      body: JSON.stringify({
        upload_url: uploadUrl,
        language: global.language,
        arxiv_id: "",
        pdf_url: PDFUrl,
        api_key: apiKey,
        models_name:modelName,
        use_cache: false,
      }),
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
    });
    const resp = await summaryResp.text();
    const result = JSON.parse(resp);
    if (result.data.err_code) {
      setSummarying(false);
      setSummaryErr(
        ReactDOMServer.renderToString(<ErrorToast code={result.data.err_code} />)
      );
      return;
    }

    if (!result.data.task_id) {
      setSummary({
        history: result.data.cache_data.history,
        progress: result.data.cache_data.progress || 0,
      });
      setSummarying(false);
      setSummarySuccess(true);
      toScrollBottom("summary");
    } else {
      const task_id = result.data.task_id;
      setSummarySuccess(true);
      getTaskInfo(task_id, "summary");
    }
  };

  const onParsePDF = async () => {
    setParseErr("");
    setSummaryErr("");
    setIsTranslate(false);
    if (queryInfo?.history.length) {
      setAnswerSuccess(true);
      return;
    }
    setParsingPaper(true);
    try {
      const parseResp = await fetch("/api/v1/arxiv/interpret", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl,
          language: global.language,
          arxiv_id: "",
          pdf_url: PDFUrl,
          api_key: apiKey,
          models_name:modelName,
          use_cache: false,
        }),
      });
      const resp = await parseResp.text();
      const result = JSON.parse(resp);
      if (result.data.err_code) {
        setParseErr(
          ReactDOMServer.renderToString(<ErrorToast code={result.data.err_code} />)
        );

        setParsingPaper(false);
        return;
      }
      if (result.data?.cache_data?.history?.length) {
        setQueryInfo({
          history: result.data.cache_data.history.filter(
            (history: string) => history.indexOf("user_say") === -1
          ),
          progress: result.data.cache_data.progress,
        });
        setParseTaskId(result.data.task_id);
        setParsingPaper(false);
        setParsedPaper(true);
        setAnswerSuccess(true);
        toScrollBottom("answer");
      } else {
        setAnswerSuccess(true);
        getTaskInfo(result.data.task_id, "parse");
      }
    } catch (error: any) {
      setParseErr(error.message);

      setParsingPaper(false);
    }
  };

  const onAnswerQuestion = async () => {
    const historyTemp = queryInfo?.history || [];
    setQueryInfo({
      history: [...historyTemp, "query-user_say-" + query],
      progress: 100,
    });
    toScrollBottom("answer");
    setQuery("");
    setQuerying(true);
    const response = await fetch("/api/v1/sse_chat", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        task_id: parseTaskId,
        query,
        language: global.language,
        api_key: apiKey || "",
        models_name:modelName,
      }),
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      readStream(reader, "");
    }

    function readStream(
      reader: ReadableStreamDefaultReader<Uint8Array>,
      answer: string
    ): Promise<ReadableStreamDefaultReader<Uint8Array> | undefined> {
      if (answer) setQuerying(false);
      return reader.read().then(({ value }) => {
        const chunk = new TextDecoder("utf-8").decode(value);
        if (chunk.indexOf("Error") > -1) {
          const chunkArr = chunk
            .replace("Error:", "")
            .replace("data:", "")
            .replace("{", "")
            .replace("}", "")
            .trimStart()
            .trimEnd()
            .split(",");
          chunkArr.forEach((chunk) => {
            if (chunk.indexOf("err_code") > -1) {
              setParseErr(
                ReactDOMServer.renderToString(<ErrorToast code={+chunk.split(":")[1]} />)
              );
              toScrollBottom("answer");
            }
          });
          setQuerying(false);
          return;
        }
        if (chunk.indexOf("[DONE]") > -1) {
          const splitAnswer = answer.split("\\n");
          const splitAnswerMarked = splitAnswer.map((str) => {
            if (str) return marked.parse(str);
            else return "";
          });
          setQueryInfo({
            history: [
              ...historyTemp,
              "query-user_say-" + query,
              "query-gpt_say-" + splitAnswerMarked.join(""),
            ],
            progress: 100,
          });
          setQuerying(false);
          return;
        }
        const chunkList = chunk
          .split("\n")
          .filter((chunk) => chunk)
          .map((chunk) =>
            chunk.replace("data:", "").trimStart().trimEnd().replace(/'/g, '"')
          );
        chunkList.forEach((chunk) => {
          if (!chunk || !isValidJSONObject(chunk)) return;
          const chunkJSON = JSON.parse(chunk);
          chunkJSON?.choices.forEach(
            (choice: {
              delta: {
                content: string;
              };
            }) => {
              const content = choice?.delta?.content;
              if (content) {
                answer += content;
                const splitAnswer = answer.split("\\n");
                const splitAnswerMarked = splitAnswer.map((str) => {
                  if (str) return marked.parse(str);
                  else return "";
                });
                setQueryInfo({
                  history: [
                    ...historyTemp,
                    "query-user_say-" + query,
                    "query-gpt_say-" + splitAnswerMarked.join(""),
                  ],
                  progress: 100,
                });
                toScrollBottom("answer");
              }
            }
          );
        });
        return readStream(reader, answer);
      });
    }
  };

  const onSendMessage = async () => {
    setParseErr("");
    onAnswerQuestion();
  };

  const onResetSummaryInfo = async () => {
    setSummary(undefined);
    setSummaryErr("");
  };

  // 提取文字
  const onExtractContent = async () => {
    setParseErr("");
    setSummaryErr("");
    setIsTranslate(false);
    if (orcData?.length) {
      setExctractSuccess(true);
      return;
    }
    setExctracting(true);
    fetch("/api/v1/file/ocr", {
      method: "post",
      body: JSON.stringify({
        upload_url: uploadUrl,
        api_key: apiKey
      }),
      headers: {
        "Content-type": "application/json",
        accept: "application/json",
      },
    })
      .then((response) => response.text())
      .then((response) => JSON.parse(response))
      .then((result) => {
        console.log('result====', result, result.data.err_code, !!result.data.err_code)
        if (result.data.err_code) {
          setExctracting(false);
          toast.error(<ErrorToast code={result.data.err_code} />)
          return;
        }
        if (result.data.status === "fail") {
          setExctracting(false);
          toast.error(result.data.msg)
          return;
        }
        setUuid(result.data.uuid);
        setOrcData(result.data.data.pages);
        setExctracting(false);
        setExctractSuccess(true);
      })
      .catch((err) => {
        toast.error(err.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          pauseOnHover: true,
          theme: "light",
          closeButton: false,
        });
        setExctracting(false);
      });
  };

  const onTransferFormat = () => {
    setParseErr("");
    setSummaryErr("");
    setIsTranslate(false);
    setIsShowTransfer(true);
  };

  const onBackHandle = async (
    type: "summary" | "answer" | "exctract" | "transfer"
  ) => {
    setIsShowMobile();
    if (type === "summary") {
      setSummarySuccess(false);
      setSummaryErr("");
    } else if (type === "answer") {
      setAnswerSuccess(false);
      setParseErr("");
    } else if (type === "exctract") {
      setExctractSuccess(false);
      setParseErr("");
    } else if (type === "transfer") {
      setIsShowTransfer(false);
    } else if (type === "translate") {
      setIsShowMobile();
      setProgressDesc("");
      setTranslateSuccess(false);
    }
  };

  const onChangeLanguage = (val: string) => {
    setLanguage(val);
  };

  const onChangeHistoryHandle = (itemId: number) => {
    const oldList = JSON.parse(
      localStorage.getItem("translateHistory") || "[]"
    );
    const newList = oldList.filter((it: { id: number }) => itemId !== it.id);
    localStorage.setItem("translateHistory", JSON.stringify(newList));
    setHistoryList(newList);
  };

  return (
    <div
      className="min-h-[100vh] flex flex-col"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      <div className="flex justify-end items-center p-2 box-border">
        <div className='flex mr-[8px] mt-[1px]'><LanguagePopover /></div>
        <TranslateHistoryDialog
          historyList={historyList}
          onChangeHistory={onChangeHistoryHandle}
        />
      </div>
      <Header />
      <div className="flex justify-center min-h-[70vh] flex-1">
        <div className="main-container px-[20px] flex justify-center relative">
          {/* 文件上传 */}
          {!isUploadSuccess && (
            <section className="max-w-[1240px] iframe_width">
              <div
                {...getRootProps({
                  style: {
                    width: "100",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    overflow: "hidden",
                    border: "2px dashed rgb(203, 213, 225)",
                    borderRadius: "0.5rem",
                    margin: "30px",
                    boxSizing: "border-box",
                  },
                })}
              >
                <div className="text-center mx-[16px]">
                  <Input type="file" name="file" {...getInputProps({})} />
                  <Button
                    disabled={uploading}
                    onClick={open}
                    className="bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700 px-9 mr-4 mt-28"
                  >
                    {uploading ? t('app.uploadingInProgress') : t('app.selectFile')}
                    <Spinner className="ml-2" loading={uploading} />
                  </Button>
                </div>
                <div className="text-center mx-[16px] mt-6">
                  <p className="text-sm text-slate-500">
                    {t('app.clickToUpload')}
                  </p>
                  <p className="text-xs mt-2 text-slate-400">
                    {t('app.fileSizeLimit')}
                  </p>
                </div>
                <p className="absolute bottom-[10px] w-full text-xs text-gray-400 text-center">
                  {t('app.nowSupported')}
                </p>
              </div>
            </section>
          )}
          {/* 操作 */}
          {isUploadSuccess &&
            !translateSuccess &&
            !summarySuccess &&
            !answerSuccess &&
            !exctractSuccess &&
            !isShowTransfer && (
              <div className="box-border w-full items-center py-[30px] flex h-full flex-col">
                {translating && (
                  <div className="absolute left-0 top-0 w-full">
                    <Progress color="violet" value={progress} />
                  </div>
                )}
                <div className="mb-[30px] w-full flex flex-center">
                  {!isMobile && (
                    <UploadComp
                      uploading={uploading}
                      disabled={translating || exctracting}
                      btnClass={cn(
                        "mr-4 border bg-white hover:bg-white active:bg-white  border-violet-500 hover:border-violet-600 active:border-violet-600 text-violet-500"
                      )}
                      onDrop={onRenewUploadHandle}
                      children={uploading ? t('app.uploadingInProgress') : t('app.chooseAgain')}
                      maxSize={50 * 1024 * 1024} // 50mb
                      maxFiles={1}
                      multiple={false}
                    />
                  )}
                  <div
                    className={cn(
                      "flex justify-center w-full",
                      isMobile ? "flex-col" : ""
                    )}
                  >
                    {!summarying && !translating && !parsingPaper && (
                      <Button
                        className={cn(
                          " bg-blue-400 hover:bg-blue-500 active:bg-blue-500",
                          isMobile ? "mb-2" : "mr-6"
                        )}
                        onClick={onExtractContent}
                        disabled={exctracting || uploading}
                      >
                        {exctracting ? t('app.extractingInProgress') : t('app.extractText')}
                      </Button>
                    )}
                    {!summarying &&
                      !translating &&
                      !parsingPaper &&
                      !exctracting && (
                        <Button
                          className={cn(
                            "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-600",
                            isMobile ? "mb-2" : "mr-6"
                          )}
                          onClick={onTransferFormat}
                          disabled={uploading}
                        >
                          {t('app.convertFormat')}
                        </Button>
                      )}
                    {!summarying &&
                      !parsingPaper &&
                      !exctracting &&
                      !translating && (
                        <Button
                          className={cn(
                            "bg-violet-600 hover:bg-violet-700 active:bg-violet-700",
                            isMobile ? "mb-2" : "mr-6"
                          )}
                          onClick={onChangeIsTranslate}
                          disabled={uploading}
                        >
                          {t('app.fullTextTranslation')}
                        </Button>
                      )}
                    {!translating && !parsingPaper && !exctracting && (
                      <Button
                        className={cn(
                          "bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-700",
                          isMobile ? "mb-2" : "mr-6"
                        )}
                        disabled={summarying || uploading}
                        onClick={onGenerateSummary}
                      >
                        {summarying ? t('app.generateSummary') : t('app.fullTextSummary')}
                      </Button>
                    )}
                    {!summarying && !translating && !exctracting && (
                      <Button
                        className={cn(
                          "bg-rose-500 hover:bg-rose-600 active:bg-rose-600",
                          isMobile ? "mb-2" : "mr-6 px-6"
                        )}
                        onClick={onParsePDF}
                        disabled={uploading}
                      >
                        {parsingPaper ? t('app.parsingInProgress') : t('app.AIQA')}
                      </Button>
                    )}
                    {isMobile && (
                      <UploadComp
                        uploading={uploading}
                        disabled={translating || exctracting}
                        btnClass={cn(
                          "w-full border bg-white hover:bg-white active:bg-white  border-violet-500 hover:border-violet-600 active:border-violet-600 text-violet-500"
                        )}
                        onDrop={onRenewUploadHandle}
                        children={uploading ? t('app.uploadingInProgress') : t('app.chooseAgain')}
                        maxSize={50 * 1024 * 1024} // 50mb
                        maxFiles={1}
                        multiple={false}
                      />
                    )}
                    {(summarying ||
                      translating ||
                      parsingPaper ||
                      exctracting) && (
                        <div className="text-sm text-center text-slate-400 leading-9">
                          {t('app.uploadPrompt')}
                        </div>
                      )}
                  </div>
                </div>
                {!isMobile && (
                  <div
                    className={cn(
                      "flex flex-1",
                      isTranslate
                        ? "box-border overflow-hidden"
                        : "pdf-container"
                    )}
                  >
                    <div
                      className={cn(
                        isTranslate ? "mr-[20px]" : "",
                        "border-2 border-dashed border-slate-300 rounded-lg overflow-hidden"
                      )}
                    >
                      <iframe
                        allowFullScreen
                        src={PDFUrl}
                        className={cn(
                          "h-full max-w-[1240px]",
                          isTranslate ? " iframe_diff_width" : "iframe_width",
                          isHeightOfA4 ? "iframe_aspect-ratio" : "iframe_height"
                        )}
                      ></iframe>
                    </div>
                    {isTranslate && (
                      <div className="flex flex-col items-center border-2 border-dashed border-slate-300 rounded-lg overflow-hidden h-full max-w-[1240px] iframe_diff_width">
                        <div className="mb-16 mt-32">
                          <p className="my-2 text-lg">{t('app.targetLanguage')}：</p>
                          <Select.Root
                            value={language}
                            defaultValue="Chinese"
                            onValueChange={onChangeLanguage}
                            size="3"
                            disabled={translating}
                          >
                            <Select.Trigger
                              style={{
                                width: 240,
                              }}
                              disabled={translating || uploading}
                            />
                            <Select.Content position="popper">
                              <Select.Item value="Chinese">{t('app.Chinese')}</Select.Item>
                              <Select.Item value="English">{t('app.English')}</Select.Item>
                              <Select.Item value="Japanese">{t('app.Japanese')}</Select.Item>
                              <Select.Item value="German">{t('app.German')}</Select.Item>
                              <Select.Item value="French">{t('app.French')}</Select.Item>
                              <Select.Item value="Korean">{t('app.Korean')}</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </div>
                        <Button
                          className="w-32 bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700"
                          disabled={translating}
                          onClick={onTranslateHandle}
                        >
                          {translating ? t('app.inTranslation') : t('app.startTranslating')}
                        </Button>
                        <p className="w-full px-10 box-border mt-10 text-sm text-center text-slate-400">
                          {progressDesc}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {isMobile &&
                  (isTranslate ? (
                    <Tabs
                      defaultValue={tabType}
                      value={tabType}
                      onValueChange={(val: string) => {
                        setTabType(val);
                      }}
                      className="box-border flex flex-col items-center flex-1"
                    >
                      <div className="w-full flex justify-center mb-2">
                        <TabsList className="h-[40px]">
                          <TabsTrigger className="flex-1 h-full" value="0">
                            {t('app.original')}
                          </TabsTrigger>
                          <TabsTrigger className="flex-1 h-full" value="1">
                            {t('app.translate')}
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      <div className="pdf-container flex flex-1">
                        <TabsContent value="0" className="h-full mt-0">
                          <div
                            className={cn(
                              "border-2 border-dashed border-slate-300 rounded-lg overflow-hidden"
                            )}
                          >
                            <iframe
                              allowFullScreen
                              src={PDFUrl}
                              className={cn(
                                "h-full max-w-[1240px] iframe_width",
                                isHeightOfA4
                                  ? "iframe_aspect-ratio"
                                  : "iframe_height"
                              )}
                            ></iframe>
                          </div>
                        </TabsContent>
                        <TabsContent value="1" className="h-full mt-0">
                          <div
                            className={cn(
                              "flex flex-col items-center border-2 border-dashed border-slate-300 rounded-lg overflow-hidden h-full max-w-[1240px] iframe_width",
                              isHeightOfA4
                                ? "iframe_aspect-ratio"
                                : "iframe_height"
                            )}
                          >
                            <div className="mb-16 mt-32">
                              <p className="my-2 text-lg">{t('app.targetLanguage')}：</p>
                              <Select.Root
                                value={language}
                                defaultValue="Chinese"
                                onValueChange={onChangeLanguage}
                                size="3"
                              >
                                <Select.Trigger
                                  style={{
                                    width: 240,
                                  }}
                                  disabled={translating || uploading}
                                />
                                <Select.Content position="popper">
                                  <Select.Item value="Chinese">{t('app.Chinese')}</Select.Item>
                                  <Select.Item value="English">{t('app.English')}</Select.Item>
                                  <Select.Item value="Japanese">{t('app.Japanese')}</Select.Item>
                                  <Select.Item value="German">{t('app.German')}</Select.Item>
                                  <Select.Item value="French">{t('app.French')}</Select.Item>
                                  <Select.Item value="Korean">{t('app.Korean')}</Select.Item>
                                </Select.Content>
                              </Select.Root>
                            </div>
                            <Button
                              className="w-32 bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700"
                              disabled={translating}
                              onClick={onTranslateHandle}
                            >
                              {translating ? t('app.inTranslation') : t('app.startTranslating')}
                            </Button>
                            <p className="w-full px-10 box-border mt-10 text-sm text-center text-slate-400">
                              {progressDesc}
                            </p>
                          </div>
                        </TabsContent>
                      </div>
                    </Tabs>
                  ) : (
                    <div className="pdf-container flex flex-1">
                      <div
                        className={cn(
                          isTranslate ? "mr-[20px]" : "",
                          "border-2 border-dashed border-slate-300 rounded-lg overflow-hidden"
                        )}
                      >
                        <iframe
                          allowFullScreen
                          src={PDFUrl}
                          className={cn(
                            "h-full max-w-[1240px]",
                            isTranslate ? " iframe_diff_width" : "iframe_width",
                            isHeightOfA4
                              ? "iframe_aspect-ratio"
                              : "iframe_height"
                          )}
                        ></iframe>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          {/* 生成PDF结果预览 */}
          {translateSuccess && (
            <TranslateComp
              language={global.language}
              onBackHandle={onBackHandle}
              transalteURL={translatePdfUrl}
              originURL={PDFUrl}
              isHeightOfA4={isHeightOfA4}
            />
          )}
          {/* 全文摘要 */}
          {summarySuccess && (
            <SummaryComp
              language={global.language}
              isHeightOfA4={isHeightOfA4}
              summarying={summarying}
              uploadUrl={PDFUrl}
              summaryErr={summaryErr}
              summary={summary}
              onGenerateSummaryHandle={onGenerateSummary}
              onResetSummaryInfoHandle={onResetSummaryInfo}
              onBackHandle={onBackHandle}
            />
          )}
          {/* AI问答 */}
          {answerSuccess && (
            <AnswerComp
              isHeightOfA4={isHeightOfA4}
              uploadUrl={PDFUrl}
              parsedPaper={parsedPaper}
              parsingPaper={parsingPaper}
              parseErr={parseErr}
              query={query}
              queryInfo={queryInfo}
              querying={querying}
              onParsePDFHandle={onParsePDF}
              onBackHandle={onBackHandle}
              onAnswerQuestion={onAnswerQuestion}
              onSendMessage={onSendMessage}
              language={global.language}
              onChange={(val: string) => setQuery(val)}
            />
          )}
          {/* 内容提取 */}
          {exctractSuccess && (
            <ContentExtract
              onBackHandle={onBackHandle}
              fileUrl={PDFUrl}
              exctracting={exctracting}
              isHeightOfA4={isHeightOfA4}
              orcData={orcData}
              uuid={uuid}
              upload_url={uploadUrl}
              fileName={fileName}
              language={global.language}
            />
          )}
          {/* 格式转化 */}
          {isShowTransfer && (
            <TransferFormatComp
              originURL={PDFUrl}
              isHeightOfA4={isHeightOfA4}
              onBackHandle={onBackHandle}
              uuid={uuid}
              upload_url={uploadUrl}
            />
          )}
        </div>
      </div>
      {!hideBrand && <PoweredBy />}
      <ToastContainer />
    </div>
  );
}

export default App;
