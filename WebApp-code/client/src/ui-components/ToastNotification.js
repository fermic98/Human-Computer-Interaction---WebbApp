import { ToastProvider, useToasts } from "react-toast-notifications";
import { useState } from "react";
import { useEffect } from "react";

function NotificationsProvider(props) {
  return (
    <ToastProvider>
      <ToastNotification
        content={props.content}
        onSet={props.onSet}
        appearance={props.appearance}></ToastNotification>
    </ToastProvider>
  );
}

function ToastNotification(props) {
  const onSet = props.onSet || (() => {});
  const content = props.message || props.content || false;
  //const title = props.title || 'SPG';
  const appearance = props.appearance || props.variant || "error";
  const onClose = props.onClose || (() => {});
  const auothide = props.auothide || undefined;

  const [canNotify, setCanNotify] = useState(true);

  const { addToast } = useToasts();

  const toastData = {
    appearance: appearance,
    autoDismiss: true,
    onDismiss: onClose,
  };

  useEffect(() => {
    if (content && canNotify) {
      addToast(content, toastData, () => {
        onSet();
        setCanNotify(true);
      });

      setCanNotify(false);
    }
  }, [canNotify, content, toastData]);

  return <></>;
}

export { NotificationsProvider };
