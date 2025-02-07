import React from "react";
import { Dialog, Flex } from "@radix-ui/themes";
import { Button } from "./ui/button";
import pdfSvg from "../assets/file-pdf-regular.svg";
import { useTranslation } from "react-i18next";

type PropTypes = {
  historyList: any[];
  onChangeHistory: Function;
};

export default function TranslateHistoryDialog({
  historyList,
  onChangeHistory,
}: PropTypes) {
  const { t } = useTranslation()

  const languages: { [Key: string]: string } = {
    Chinese: "中文",
    English: "英语",
    Japanese: "日语",
    German: "德语",
    French: "法语",
    Korean: "韩语",
  };

  const historyListDom = historyList.map(
    (
      item: {
        name: string;
        translateDate: string;
        url: string;
        id: number;
        language: string;
      },
      index: number
    ): React.ReactNode => {
      return (
        <li
          key={item.translateDate}
          className="flex justify-between items-center text-black  hover:text-gray-600 py-[4px]"
        >
          <div className="flex items-center">
            <span className="mr-[4px]">{`${index + 1}.`}</span>
            <span className="mr-[10px] w-[16px] h-[16px]">
              <img className="w-full h-full" src={pdfSvg} alt="" />
            </span>
            <a
              href={item.url}
              target="_blank"
              className="mr-4 filename block max-w-[300px]"
              title={item.name}
            >
              {item.name}
            </a>
            <span className="mr-[30px]">{languages[item.language]}</span>
            <span className="isShowTime">{item.translateDate}</span>
          </div>
          <Dialog.Root>
            <Dialog.Trigger>
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                color="red"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Dialog.Trigger>
            <Dialog.Content>
              <Flex justify="between">
                <Dialog.Title>{t('tips')}</Dialog.Title>
                <Dialog.Close className="cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Dialog.Close>
              </Flex>
              <Dialog.Description>
                {t('deleteTips')}
              </Dialog.Description>
              <div className="flex justify-end">
                <Button
                  className="max-w-[100px] bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700 px-9"
                  onClick={() => {
                    onChangeHistory(item.id);
                  }}
                >
                  {t('auth.confirm')}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </li>
      );
    }
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger className="mr-2">
        <svg
          style={{ marginTop: "0.5px", cursor: "pointer" }}
          width="17"
          height="17  "
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.15 7.49998C13.15 4.66458 10.9402 1.84998 7.50002 1.84998C4.72167 1.84998 3.34849 3.9064 2.76335 5H4.5C4.77614 5 5 5.22386 5 5.5C5 5.77614 4.77614 6 4.5 6H1.5C1.22386 6 1 5.77614 1 5.5V2.5C1 2.22386 1.22386 2 1.5 2C1.77614 2 2 2.22386 2 2.5V4.31318C2.70453 3.07126 4.33406 0.849976 7.50002 0.849976C11.5628 0.849976 14.15 4.18537 14.15 7.49998C14.15 10.8146 11.5628 14.15 7.50002 14.15C5.55618 14.15 3.93778 13.3808 2.78548 12.2084C2.16852 11.5806 1.68668 10.839 1.35816 10.0407C1.25306 9.78536 1.37488 9.49315 1.63024 9.38806C1.8856 9.28296 2.17781 9.40478 2.2829 9.66014C2.56374 10.3425 2.97495 10.9745 3.4987 11.5074C4.47052 12.4963 5.83496 13.15 7.50002 13.15C10.9402 13.15 13.15 10.3354 13.15 7.49998ZM7.5 4.00001C7.77614 4.00001 8 4.22387 8 4.50001V7.29291L9.85355 9.14646C10.0488 9.34172 10.0488 9.65831 9.85355 9.85357C9.65829 10.0488 9.34171 10.0488 9.14645 9.85357L7.14645 7.85357C7.05268 7.7598 7 7.63262 7 7.50001V4.50001C7 4.22387 7.22386 4.00001 7.5 4.00001Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="650px">
        <Flex justify="between">
          <Dialog.Title>{t('translationHistory')}</Dialog.Title>
          <Dialog.Close className="cursor-pointer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Dialog.Close>
        </Flex>
        <ul className="mt-4">
          {historyListDom}
          {historyList.length === 0 && (
            <div className="text-center text-gray-500">{t('noTranslationHistory')}</div>
          )}
        </ul>
      </Dialog.Content>
    </Dialog.Root>
  );
}
