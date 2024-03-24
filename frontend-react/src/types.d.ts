type PropsWithChildren<P> = P & { children?: ReactNode };

type PropsAny = PropsWithChildren<{}>