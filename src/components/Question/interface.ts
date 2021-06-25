import { ReactNode } from "react";

export interface IQuestion {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}