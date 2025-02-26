export function PageHeader({ title, description }: { title: string, description?: string }) {
    return (
        <div>
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                {title}
            </h2>
            {description && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}