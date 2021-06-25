import { IComponentButton } from "./interface";
import './styles.scss';

export function Button({
    type,
    isOutlined,
    ...rest
}: IComponentButton) {
    return (
        <button 
            className={`button ${isOutlined ? 'outlined' : ''}`}
            type={type || "button"}
            {...rest}
        >

        </button>
    )
}