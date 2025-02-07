import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

type props = {
  type: string;
  language: string | undefined;
  disabled: boolean;
  onReturnHandle: Function;
};


export default function ReturnBtn(props: props) {
  const { t } = useTranslation()

  return (
    <Dialog>
      <DialogTrigger
        disabled={props.disabled}
        className="ml-4 h-[36px] text-nowrap border-violet-500 hover:border-violet-600 active:border-violet-600 text-violet-500 outline-1 text-[14px] outline bg-transparent rounded-md hover:bg-transparent font-medium px-10 box-border"
      >
        {t('return')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="text-[20px]">{t('tips')}</span>
          </DialogTitle>
          <DialogDescription className="text-lg">
            {t('bringForward')}
          </DialogDescription>
          <div className="text-right">
            <Button
              size="sm"
              onClick={() => {
                props.onReturnHandle(props.type);
              }}
              className="relative right-0 outline-1 outline bg-violet-500 rounded-md hover:bg-violet-600 font-medium px-[10px] box-border w-[100px]"
            >
              {t('exit')}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
