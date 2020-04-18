import React from "react";
import { useRoutes, useRedirect } from "hookrouter";
import NavBar from "../components/Navbars/NavBar";

import Facilitator from "../components/Facilitator/Facilitator";
import FacilitatorViewHotel from "../components/Facilitator/FacilitatorViewHotel";
import AddHotelForm from "../components/Facilitator/AddHotelForm";
import AddRoom from "../components/Facilitator/AddRoom";

const routes = {
	"/": () => <Facilitator />,
	"/hotel/add": () => <AddHotelForm />,
	"/hotel/:id": ({ id }) => <FacilitatorViewHotel id={id} />,
	"/hotel/:id/room/add": ({ id }) => <AddRoom id={id} />,
};

const FacilitatorRouter = () => {
	useRedirect("/login", "/");
	const pages = useRoutes(routes);
	
	return (
		<div className="bg-gray-200">
			<NavBar />
			{pages}
			{!pages && (
				<div className="h-screen flex justify-center py-16">
					Error 404: Page not found
				</div>
			)}
		</div>
	);
};

export default FacilitatorRouter;
