import { useEffect, useState } from "react";
import { FirebaseDatabase } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
};

type FirebaseQuestions = Record<string, QuestionType>;

interface IQuestion extends Omit<QuestionType, "likes">{
    id: string;
    likeCount: number;
    likeId?: string;
}

export function useRoom(roomId: string) {
    const {user} = useAuth();
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const [title, setTitle] = useState("");

    const handleCreateNewQuestion = async (questionValue: string) => {
        if(!user)
            return;

        const question = {
            content: questionValue,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false,
            likeCount: 0
        };

        const firebaseReturnOfAdd = await FirebaseDatabase.ref(`rooms/${roomId}/questions`).push(question);

        const questionAddedKey = firebaseReturnOfAdd.key;

        if(questionAddedKey)
            setQuestions(prevState => [...prevState, { ...question, id: questionAddedKey }]);
    };

    const handleLikeQuestion = async (questionId: string, likeId?: string) => {
        if(!user)
            return;

        if(!likeId){
            const newLike = await FirebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user.id
            });
            setQuestions(prevState => prevState.map(question => {
                if(question.id === questionId)
                    return {
                        ...question,
                        likeId: newLike.key || undefined,
                        likeCount: question.likeCount + 1
                    };
                return question; 
            }));
            return;
        }

        await FirebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
        setQuestions(prevState => prevState.map(question => {
            if(question.id === questionId)
                return {
                    ...question,
                    likeId: undefined,
                    likeCount: question.likeCount - 1
                };
            return question; 
        }));
        return;
            
    }

    const handleDeleteQuestion = async (questionId: string) => {
        await FirebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        setQuestions(prevState => prevState.filter(question => question.id !== questionId));
    };

    const handleCloseRoom = async () => {
        await FirebaseDatabase.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        });
    };

    const handleMarkQuestionAsAnswered = async (questionId: string) => {
        await FirebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).update({
           isAnswered: true 
        });
        setQuestions(prevState => prevState.map(question => {
            if(question.id === questionId)
                return {
                    ...question,
                    isAnswered: true
                };
            return question; 
        }));
    };

    const handleHighlightQuestion = async (questionId: string) => {
        await FirebaseDatabase.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true 
        });
        setQuestions(prevState => prevState.map(question => {
            if(question.id === questionId)
                return {
                    ...question,
                    isHighlighted: true
                };
            return question; 
        }));
    };

    useEffect(() => {
        const roomDatabaseRef = FirebaseDatabase.ref(`rooms/${roomId}`);

        roomDatabaseRef.once('value', room => {
            const firebaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = firebaseRoom.questions ?? {};
            const questions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setTitle(firebaseRoom.title);
            setQuestions(questions);
        });

        return(() => {
            roomDatabaseRef.off('value');
        });

    }, [roomId, user]);

    return { 
        questions, 
        title, 
        handleCreateNewQuestion, 
        handleLikeQuestion, 
        handleDeleteQuestion, 
        handleCloseRoom,
        handleMarkQuestionAsAnswered,
        handleHighlightQuestion 
    }
}