import { Fragment, PropsWithChildren } from "react";

export default function Modal({ children }: PropsWithChildren) {
	return (
		<div className="">
			<div className="fixed inset-0 bg-black opacity-70"></div>
			<div className="fixed inset-x-0 top-0 z-50 flex h-[calc(100%-1rem)] w-full justify-center overflow-y-auto overflow-x-hidden p-4 md:inset-0">
				<div>
					<div className="w-full max-w-md bg-white p-5 dark:bg-black">
						<Fragment>{children}</Fragment>
					</div>
				</div>
			</div>
		</div>
	);
}
