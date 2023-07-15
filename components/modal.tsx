import { Fragment, ReactElement } from "react";

export default function Modal({ children }: { children: ReactElement | ReactElement[] }) {
	return (
		<div>
			<div className="fixed inset-0 bg-black opacity-50"></div>
			<div className="flex justify-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)]">
				<div>
					<div className="bg-white w-full max-w-md p-5">
						<Fragment>{children}</Fragment>
					</div>
				</div>
			</div>
		</div>
	);
}
