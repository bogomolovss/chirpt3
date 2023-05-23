import type { PropsWithChildren } from "react";


export const PageLayout = (props: PropsWithChildren<{}>) => {
    return (
        <main className="flex h-screen justify-center">
            <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
                <div className="flex border-b border-slate-400 p-4 ">
                    {props.children}
                </div>
            </div>
        </main>
    );
};