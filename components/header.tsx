import LanguageSelect from "@/components/languageSelect";
import Link from "next-intl/link";
import HeaderBagButton from "@/components/headerBagButton";

export default function Header() {
    return <header className="flex bg-purple-500">
        <LanguageSelect></LanguageSelect>
        <div className="flex gap-2 ml-auto">
            <Link href="/likes"
                className="
                            m-2 flex-none flex items-center justify-center w-12 h-12 text-slate-300
                        "
                >
                <svg width="3rem" height="3rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M57.39 29.88c2.08-6.41 1.78-13.61-2.77-18.16a15.94 15.94 0 0 0-22.54 0 15.94 15.94 0 0 0-22.54 0c-6.22 6.22-4.48 17.41.4 24.73s17.12 16.67 21 19.49a2 2 0 0 0 2.36 0l1.7-1.31"></path>
                    <path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" d="M55.6 27.48a11 11 0 0 0-15.51 0 11 11 0 0 0-15.51 0c-4.28 4.28-3.09 12 .27 17 3.25 4.88 11.05 10.91 14 13.13a2 2 0 0 0 2.38 0c3-2.22 10.79-8.25 14-13.13 3.46-5.02 4.65-12.72.37-17z"></path>
                </svg>
            </Link>
            <HeaderBagButton></HeaderBagButton>
        </div>
    </header>;
}