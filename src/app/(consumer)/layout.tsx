import { ReactNode } from "react";

export default function ConsumerLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <>
            {children}
        </>
    )
}