import {useState} from "react";
import * as React from "react";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";
import {useLocale} from "next-intl";
import Link from "next-intl/link";

export default function CategoryTreeView({ tree, current}: {
    tree: CategoriesNodeDto[],
    current: string,
}) {
    const locale = useLocale();

    // Find recursively current category node by "current" param and id property
    // Also, collect all parent nodes
    const [currentNode, setCurrentNode] = useState<CategoriesNodeDto | null>(null);
    const [selectedLeafs, setSelectedLeafs] = useState<CategoriesNodeDto[]>([]);
    if (!currentNode) {
        const findNode = (node: CategoriesNodeDto, parents: CategoriesNodeDto[]) => {
            if (node.id === current) {
                setCurrentNode(node);
                setSelectedLeafs([...parents, node]);
            } else {
                for (const child of node.children) {
                    findNode(child, [...parents, node]);
                }
            }
        }
        for (const node of tree) {
            findNode(node, []);
        }
    }

    function CategoryTreeNode({ key, node, parents }: { key: string, node: CategoriesNodeDto, parents: CategoriesNodeDto[] }) {
        const isSelected = selectedLeafs.some(v => v.id === node.id);

        return (
            <div className="px-4 py-1" key={key}>
                <div
                    className="cursor-pointer flex"
                >
                    <Link href={`catalog/${([...parents, node]).map(p => p.id).join("/")}`} className={isSelected ? "font-bold" : ""}>{node.title[locale]}</Link>
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
