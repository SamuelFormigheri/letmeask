import { useHistory, useParams } from 'react-router-dom';
import AssetsLogoImg from '../assets/logo.svg';
import AssetsDeleteImg from '../assets/delete.svg';
import AssetsCheckImg from '../assets/check.svg';
import AssetsAnswerImg from '../assets/answer.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';

type RoomParams = {
    id: string;
};

export function AdminRoom(){
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { 
        title, 
        questions, 
        handleDeleteQuestion: deleteQuestion, 
        handleCloseRoom: closeRoom, 
        handleMarkQuestionAsAnswered: markAsAnswered ,
        handleHighlightQuestion: highlightQuestion
    } = useRoom(roomId);

    const handleDeleteQuestion = async (questionId: string) => {
       if(window.confirm('Are you sure you want to delete this question')){
            await deleteQuestion(questionId);
       } 
    };

    const handleMarkQuestionAsAnswered = async (questionId: string) => {
        markAsAnswered(questionId);
    };

    const handleHighlightQuestion = async (questionId: string) => {
        highlightQuestion(questionId);
    };

    const handleCloseRoom = async () => {
        await closeRoom();
        history.push('/');
    };

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={AssetsLogoImg} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined
                            onClick={handleCloseRoom}
                        >Close Room</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    {questions.length > 0 && (
                        <span> {questions.length} question(s)</span>
                    )} 
                </div>

                
                <div className="questions-list">
                    {questions.map((question) => {
                        return (
                            <Question 
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleMarkQuestionAsAnswered(question.id)}
                                        >
                                            <img src={AssetsCheckImg} alt="Mark question as answered"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={AssetsAnswerImg} alt="Highlight the question"/>
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={AssetsDeleteImg} alt="Remove question"/>
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}