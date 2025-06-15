import Alert from "../elements/alert";
import { XCircleIcon } from "@heroicons/react/20/solid";

export default function FetchFailedAlert({ setFetchFailed }) {
  const icon = <XCircleIcon className="h-5 w-5 text-danger-400" />;
  return (
    <Alert color="danger" icon={icon} handleDismiss={() => setFetchFailed(false)} className="mb-3">
      <strong className="font-semibold text-danger-800 dark:text-danger-300">Uh oh.</strong> Something went wrong.
    </Alert>
  );
}
