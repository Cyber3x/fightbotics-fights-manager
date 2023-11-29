import { Trash } from "lucide-react";

const ErrorMessage = ({
  errorMessage,
  onDelete,
}: {
  errorMessage: string;
  onDelete: () => void;
}) => {
  return (
    <p className="bg-red-300 border-2 border-red-500 p-4 text-md w-fit flex">
      {errorMessage}
      <Trash className="ml-4" onClick={onDelete} />
    </p>
  );
};

export default ErrorMessage;
