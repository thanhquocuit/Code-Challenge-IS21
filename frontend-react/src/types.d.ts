declare module 'ui-avatar-svg' {
    export default class UIAvatarSvg {
        text(txt: string): UIAvatarSvg;
        fontFamily(val: string): UIAvatarSvg;
        fontWeight(val: string): UIAvatarSvg;
        size(val: number): UIAvatarSvg;
        bgColor(color: string): UIAvatarSvg;
        textColor(color: string): UIAvatarSvg;
        generate(): voidd;
    }
}

type PropsWithChildren<P> = P & { children?: ReactNode };

type PropsAny = PropsWithChildren<{}>