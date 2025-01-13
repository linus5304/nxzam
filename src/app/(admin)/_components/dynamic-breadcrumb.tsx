'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation";
import React from "react";

export function DynamicBreadcrumb() {
    const pathSegments = usePathname().split('/').filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathSegments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {index < pathSegments.length - 1 ? (
                                <>
                                    <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                                        {segment}
                                    </BreadcrumbLink>
                                </>
                            ) : (
                                <BreadcrumbPage>{segment}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}