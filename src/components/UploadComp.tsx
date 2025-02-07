import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export default function UploadComp({ children, style, btnClass, disabled, uploading, ...props }: any) {
  const { t } = useTranslation()

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 50mb
    maxFiles: 1,
    multiple: false,
    ...props,
  });

  return (
    <>
      {
        (uploading || disabled) ?
          <div>
            <Input type="file" name="file" {...getInputProps()} />
            <Button
              disabled={uploading || disabled}
              className={
                btnClass
                  ? btnClass
                  : "bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700 px-9 mr-4"
              }
            >
              {children ? children : t('app.selectFile')}
              <Spinner className="ml-2" loading={uploading} />
            </Button>
          </div> :
          <div
            {...getRootProps({
              style,
            })}
          >
            <Input type="file" name="file" {...getInputProps()} />
            <Button
              disabled={uploading || disabled}
              className={
                btnClass
                  ? btnClass
                  : "bg-violet-500 box-border hover:bg-violet-600 active:bg-violet-700 px-9 mr-4"
              }
            >
              {children ? children : t('app.selectFile')}
              <Spinner className="ml-2" loading={uploading} />
            </Button>
          </div>

      }

    </>
  );
}
