import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import { Switch } from "../../components/ui/switch";
import { THERAPIES_LIST, TherapyItem } from "./therapiesList";
import { useEffect, useState } from "react";
import {  DotsVerticalIcon } from "@radix-ui/react-icons";
import { TherapiesAdd } from "./TherapiesAdd";
import { TrashIcon, XIcon } from "lucide-react";

const Therapies = () => {
	const [therapies, setTherapies] = useState(() => {
		const localData = localStorage.getItem("therapiesList");
		return localData ? JSON.parse(localData) : THERAPIES_LIST;
	});
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		localStorage.setItem("therapiesList", JSON.stringify(therapies));
	}, [therapies]);

	const toggleInProgress = (name: string) => {
		const updatedTherapys = therapies.map((therapy: TherapyItem) => {
			if (therapy.label === name) {
				return { ...therapy, inProgress: !therapy.inProgress };
			}
			return therapy;
		});
		setTherapies(updatedTherapys);
	};

	const deleteTherapy = (label: string) => {
		const updatedTherapies = therapies.filter(
			(therapies: TherapyItem) => therapies.label !== label
		);
		setTherapies(updatedTherapies);
	};

	const addTherapy = (newTherapy: TherapyItem) => {
		setTherapies((prevTherapies: TherapyItem[]) => [
			newTherapy,
			...prevTherapies,
		]);
	};

	return (
		<div className=" bg-[#161617] rounded-3xl h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8">
			<div className="flex w-full flex-1 overflow-y-auto overflow-x-hidden pr-1">
				<div className="flex flex-col w-full flex-1 overflow-auto pr-1 px-4 pt-4">
					<div className="flex w-full justify-between items-center mb-8">
						<div className="font-bold text-2xl text-white">Therapies</div>
						<div className="flex flex-row gap-2">
							<TherapiesAdd onSubmit={addTherapy} />
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
							<TableHeader>
								<TableRow className="bg-white hover:bg-white">
									{editMode && <TableHead></TableHead>}
									<TableHead>Therapy</TableHead>
									<TableHead>In progress</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="text-slate-200 ">
								{therapies.map((item: TherapyItem) => (
									<TableRow key={item.label} className=" ">
										{editMode && (
											<TableCell className="text-center">
												<TrashIcon
													className="w-5 h-5 text-red-500 self-center cursor-pointer"
													onClick={() => deleteTherapy(item.label)}
												/>
											</TableCell>
										)}
										<TableCell className="">{item.label}</TableCell>
										<TableCell>
											<Switch
												checked={item.inProgress}
												onCheckedChange={() => toggleInProgress(item.label)}
											
											/>
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

export default Therapies;

