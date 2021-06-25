import { IComponentRoomCode } from "./interface";
import AssetsCopyImg from '../../assets/copy.svg';
import './styles.scss';

export function RoomCode({
    code
}: IComponentRoomCode) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(code);
    }
    return (
        <button 
            className="room-code"
            type="button"
            onClick={copyRoomCodeToClipboard}
        >
            <div>
                <img src={AssetsCopyImg} alt="Copy" />
            </div>
            <span>Room {code}</span>
        </button>
    )
}