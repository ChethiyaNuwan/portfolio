import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ButtonType as ButtonProps } from '@/types';

export default function Button({
    icon,
    title,
    onClick,
    position = "left",
    className = "",
    href,
    target = "_self",
    download = false,    
}: ButtonProps) {
    if (href) { 
        return (
            <Link href={href} className="w-full" download={download} target={target}>
                <ButtonBase
                    icon={icon}
                    title={title}
                    onClick={onClick}
                    position={position}
                    className={className}
                />
            </Link>
        );
    }
    return <ButtonBase {...{ icon, title, onClick, position, className }} />;
}


function ButtonBase({
    icon,
    title,
    position = "left",
    className = "",
    onClick,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "transition-all duration-300 rounded-[10px] border border-dark-gray-4 flex gap-[6px] cursor-pointer items-center flex-nowrap justify-center overflow-visible p-[14px_18px] relative group",
                position === "left" ? "flex-row" : "flex-row-reverse",
                !/w-(\S+)/.test(className) && "w-full",
                className
            )}
        >
            {icon && (
                <div>
                    <span className={clsx("opacity-70")}>{icon}</span>
                </div>
            )}
            <div className="flex-none h-auto relative w-auto whitespace-pre opacity-70 flex-shrink-0 flex-col justify-start flex group-hover:opacity-100">
                <p className={clsx("uppercase font-medium font-IBM_Plex_Mono leading-[100%] text-[15px] whitespace-pre", className)}>
                    {title}
                </p>
            </div>
        </button>
    );
}
