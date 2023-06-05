import LanguageSelect from "@/components/languageSelect";
import Link from "next-intl/link";
import HeaderBagButton from "@/components/headerBagButton";
import {HeartIcon} from "@heroicons/react/24/outline";

export default function Header() {
    return <header className="flex bg-purple-500">
        <LanguageSelect></LanguageSelect>
        <div className="flex gap-2 ml-auto">
            <Link href="/likes"
                className="
                            m-2 flex-none flex items-center justify-center w-12 h-12 text-slate-300
                        "
                >
                <HeartIcon className="h-16 w-16" stroke="white" />
            </Link>
            <HeaderBagButton></HeaderBagButton>
        </div>
    </header>;
}
