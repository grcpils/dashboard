import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BrandedButton(props) {
    return (
        <button onClick={props.onClick} className={`btn btn-brand btn-${props.brand}`}>
            <FontAwesomeIcon icon={props.icon} />
            {props.children} 
        </button>
    )
}