import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import { Switch } from "../../components/ui/switch";
import { SupplementType, supplementsList } from "./supplementsList";
import { useEffect, useState } from "react";
import {
	ArrowRightIcon,
	DotsVerticalIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import Tooltip from "../../common/tooltip";
import { XIcon } from "lucide-react";
import { SupplementsAdd } from "./SupplementsAdd";

const Supplements = () => {
	function getSupplements() {
		const localData = localStorage.getItem("supplementsList");
		if (localData) {
			const localDataArray = JSON.parse(localData);
			const supplementsListArray = supplementsList;
			const newSupplements = supplementsListArray.filter((item: SupplementType) => {
				return !localDataArray.some((localItem: SupplementType) => item.id === localItem.id);
			});
			const updatedSupplementsList = [...newSupplements, ...localDataArray];
			return updatedSupplementsList;
		}
		return supplementsList;
	}

	const [supplements, setSupplements] = useState(getSupplements());
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		localStorage.setItem("supplementsList", JSON.stringify(supplements));
	}, [supplements]);

	const toggleOrdered = (id: string) => {
		const updatedSupplements = supplements.map((supplement: SupplementType) => {
			if (supplement.id === id) {
				return { ...supplement, ordered: !supplement.ordered };
			}
			return supplement;
		});
		setSupplements(updatedSupplements);
	};

	const toggleInProgress = (id: string) => {
		const updatedSupplements = supplements.map((supplement: SupplementType) => {
			if (supplement.id === id) {
				return { ...supplement, inProgress: !supplement.inProgress };
			}
			return supplement;
		});
		setSupplements(updatedSupplements);
	};

	const deleteSupplement = (id: string) => {
		const updatedSupplements = supplements.filter(
			(supplement: SupplementType) => supplement.id !== id
		);
		setSupplements(updatedSupplements);
	};

	const addSupplement = (newSupplement: SupplementType) => {
		setSupplements((prevSupplements: SupplementType[]) => [
			newSupplement,
			...prevSupplements,
		]);
	};

	const handleDosageChange = (id: string, newDosage: string) => {
		const updatedSupplements = supplements.map((supplement: SupplementType) => {
			if (supplement.id === id) {
				return { ...supplement, dosage: newDosage };
			}
			return supplement;
		});
		setSupplements(updatedSupplements);
	};

	return (
		<div className=" bg-[#161617] rounded-3xl h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8">
			<div className="flex w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
				<div className="flex flex-col w-full flex-1 overflow-auto pr-1 pt-4">
					<div className="flex w-full justify-between items-center mb-8">
						<div className="font-bold text-2xl text-white">Supplements</div>
						<div className="flex flex-row gap-2">
							<SupplementsAdd onSubmit={addSupplement} />
							{editMode ? (
								<XIcon
									className="w-6 h-6 mr-4 text-white cursor-pointer"
									onClick={() => setEditMode(!editMode)}
								/>
							) : (
								<DotsVerticalIcon
									className="w-6 h-6 mr-4 text-white cursor-pointer"
									onClick={() => setEditMode(!editMode)}
								/>
							)}
						</div>
					</div>
					<div className="w-full">
						<Table className="">
							<TableHeader className="">
								<TableRow className="bg-white hover:bg-white ">
									{editMode && <TableHead></TableHead>}
									<TableHead className="">Supplement</TableHead>
<TableHead>Dosage</TableHead>
<TableHead>Ordered</TableHead>
<TableHead>In progress</TableHead>
<TableHead>Link</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="text-slate-200">
								{supplements.map((item: SupplementType) => (
									<TableRow key={item.id}>
										{editMode && (
											<TableCell className="text-center">
												<TrashIcon
													className="w-5 h-5 text-red-500 self-center cursor-pointer"
													onClick={() => deleteSupplement(item.id)}
												/>
											</TableCell>
										)}
										<TableCell className="max-w-[200px]">
											<Tooltip content={item.description}>
												{item.supplement}
											</Tooltip>
										</TableCell>
										<TableCell className="max-w-[150px] overflow-hidden whitespace-nowrap truncate">
											{editMode ? (
												<input
													type="text"
													value={item.dosage}
													onChange={(e) => handleDosageChange(item.id, e.target.value)}
													className="bg-transparent text-white border-none focus:outline-none"
												/>
											) : (
												item.dosage || "N/A"
											)}
										</TableCell>
										<TableCell>
											<Switch
												checked={item.ordered}
												onCheckedChange={() => toggleOrdered(item.id)}
											/>
										</TableCell>
										<TableCell>
											<Switch
												checked={item.inProgress}
												onCheckedChange={() => toggleInProgress(item.id)}
											/>
										</TableCell>
										<TableCell>
											{item.link ? (
												<a
													href={item.link}
													target="_blank"
													rel="noopener noreferrer"
													className="gap-1 flex-row flex items-center"
												>
													Learn More
													<ArrowRightIcon className="w-4 h-4 ml-2" />
												</a>
											) : (
												"N/A"
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Supplements;
