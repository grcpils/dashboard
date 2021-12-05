import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RoundIconButton(props) {
    return (
        <a href={(props.link) ? props.link : `#${props.name}`} onClick={props.fn} className={`btn-rounded-icon ${props.className}`}>
            <FontAwesomeIcon icon={props.icon} />
        </a>
    )
}