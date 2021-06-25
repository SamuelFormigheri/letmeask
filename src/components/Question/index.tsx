import { IQuestion } from "./interface";
import './styles.scss';

export function Question({
    author,
    content,
    children,
    isAnswered = false,
    isHighlighted = false
}: IQuestion) {
    return (
        <div 
            className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}
        >
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name}/>
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )
}