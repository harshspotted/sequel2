import { useState } from "react";
import { File } from "lucide-react";
import { LucideFileJson2 } from "lucide-react";
import { Trash } from "lucide-react";
type Props = {
  thisFile: { name: string; content: string; createdDate: number, type: string };
  handleRemoveFile: () => void;
};

type SpinnerProps = {
	color?: string;
  };

const FileTag = ({ thisFile, handleRemoveFile }: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [file] = useState<{
    name: string;
    content: string;
    createdDate: number;
    type: string;
  }>(thisFile);
	const [showTrashIcon, setShowTrashIcon] = useState<boolean>(false);

	const Spinner = ({ color = "bg-red-400" }: SpinnerProps) => (
		<span className={`relative flex h-3 w-3`}>
			<span
				className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
			></span>
			<span
				className={`relative inline-flex rounded-full h-3 w-3 ${color}`}
			></span>
		</span>
	);

	return (
		<div
			className={`relative flex flex-col mr-2 h-[160px] w-[160px] items-start gap-2 bg-[rgba(40,40,40,0.58)] p-3 pl-2 pr-[18px] rounded-xl mb-2 whitespace-nowrap shadow-sm ${
				showTrashIcon ? "border border-[#323232]" : "border border-transparent"
			}`}
			style={{ pointerEvents: "auto" }}
			onMouseEnter={() => setShowTrashIcon(true)}
			onMouseLeave={() => setShowTrashIcon(false)}
		>
			{file.type === "application/pdf" ? (
				 <File className={`self-center w-10 h-10 text-white`} />
			) : (
				 <LucideFileJson2 className={`self-center w-10 h-10 text-white`} />
			)}
			<div className={`max-w-full cursor-default space-y-4`}>
				<div className="text-start">
					<div className="text-[#F1F1F1] font-medium truncate text-ellipsis">
						{file.name}
					</div>
				</div>
				<div>
				<p className="text-xs text-gray-100 mt-2">Available</p>
				<p className="text-xs text-[#8E7469]">
					{new Date(file?.createdDate)?.toISOString()?.split("T")[0]}
				</p>
				</div>
			</div>
			{loading ? (
				<Spinner color="bg-red-400" />
			) : (
				showTrashIcon && (
					<div className="items-center">
						<Trash
							onClick={() => handleRemoveFile()}
							className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
						/>
					</div>
				)
			)}
		</div>
	);
};

export default FileTag;
