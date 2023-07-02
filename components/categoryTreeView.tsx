import {useState} from "react";
import * as React from "react";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";
import {useLocale} from "next-intl";
import Link from "next-intl/link";

export default function CategoryTreeView({ tree, selectedCategories}: {
    tree: CategoriesNodeDto[],
    selectedCategories: string[],
}) {
    const locale = useLocale();

    // Find recursively current category node by "current" param and id property
    // Also, collect all parent nodes
    const [selectedLeafs, setSelectedLeafs] = useState<CategoriesNodeDto[]>([]);
    if (selectedLeafs.length === 0) {
        let leafs: CategoriesNodeDto[] = [];
        const findNode = (node: CategoriesNodeDto, parents: CategoriesNodeDto[], depth: number) => {
            const selectedCategory = selectedCategories[depth];
            if (selectedCategory != node.publicId) {
                return;
            }

            leafs = [...parents, node];
            for (const child of node.children) {
                findNode(child, [...parents, node], depth + 1);
            }
        }
        for (const node of tree) {
            findNode(node, [], 0);
        }
        setSelectedLeafs(leafs);
    }

    function CategoryTreeNode({ node, parents }: { node: CategoriesNodeDto, parents: CategoriesNodeDto[] }) {
        const isSelected = selectedLeafs.some(v => v.id === node.id);

        console.log("parents", parents.map(v => v.publicId).join("/"), "node", node.publicId, "isSelected", isSelected)

        return (
            <div className="px-4 py-1" style={{ width: "200px"}}>
                <div
                    className="cursor-pointer flex hover:underline"
                >
                    <Link href={`/catalog/${([...parents, node]).map(p => p.publicId).join("/")}`} className={isSelected ? "font-bold" : ""}>{node.title[locale]}</Link>
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
        )
    }

    return (
        <div>
            {tree.map((node) => (
                <CategoryTreeNode
                    key={node.id}
                    node={node}
                    parents={[]}
                />
            ))}
        </div>
    )
}
