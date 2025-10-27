import Image from "next/image";
import DcAppSwitcher from "@/app/components/DcAppswitcher";
import Head from "next/head";
import Script from "next/script";


export default function Home() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center font-sans dark:bg-white">
            <h1>Hello World!!!</h1>
            <DcAppSwitcher/>
        </div>
    );
}
