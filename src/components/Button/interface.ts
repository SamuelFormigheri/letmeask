import { ButtonHTMLAttributes } from "react";

export interface IComponentButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    isOutlined?: boolean;
}