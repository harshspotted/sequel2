import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar"; 

const PageLayout = () => {
	return (
		<div className="flex flex-col bg-[transparent] rounded-2xl h-[calc(100vh-100px)] w-full">
		
			<Navbar />

			<div className="w-full h-full mt-2">
				<Outlet />
			</div>
		</div>
	);
};

export default PageLayout;