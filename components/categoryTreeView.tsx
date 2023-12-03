import { useSearchParams } from "next/navigation";
import * as qs from "qs";
import * as React from "react";

import { Link } from "@/navigation";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categoriesTree.dto";

export default function CategoryTreeView({
	tree,
	selectedCategories,
	className,
}: {
	tree: CategoriesNodeDto[];
	selectedCategories: string[];
	className?: string;
}) {
	const searchParameters = useSearchParams();

	let selectedLeafs: CategoriesNodeDto[] = [];
	const findNode = (node: CategoriesNodeDto, parents: CategoriesNodeDto[], depth: number) => {
		const selectedCategory = selectedCategories[depth];
		if (selectedCategory != node.publicId) {
			return;
		}

		selectedLeafs = [...parents, node];
		for (const child of node.children) {
			findNode(child, [...parents, node], depth + 1);
		}
	};
	for (const node of tree) {
		findNode(node, [], 0);
	}

	function CategoryTreeNode({
		node,
		parents,
	}: {
		node: CategoriesNodeDto;
		parents: CategoriesNodeDto[];
	}) {
		const isSelected = selectedLeafs.some((v) => v.id === node.id);

		const parameters = qs.parse(searchParameters.toString());
		delete parameters.attrs;
		const newSearchParameters = qs.stringify(parameters);

		return (
			<div className="px-4 py-1" style={{ width: "200px" }}>
				<div className="flex cursor-pointer hover:underline">
					<Link
						href={`/catalog/${[...parents, node]
							.map((p) => p.publicId)
							.join("/")}?${newSearchParameters}`}
						className={isSelected ? "font-bold" : ""}
					>
						{node.title}
					</Link>
				</div>
				<div className="flex">
					<div>
						{isSelected && node.children.length > 0 && (
							<div className="flex flex-col">
								{node.children.map((v) => (
									<CategoryTreeNode
										key={v.id}
										node={v}
										parents={[...parents, node]}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={className}>
			{tree.map((node) => (
				<CategoryTreeNode key={node.id} node={node} parents={[]} />
			))}
		</div>
	);
}
