import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BrandedButton(props) {
    return (
        <button onClick={props.onClick} className={`mb-2 btn btn-${props.brand}`}>
            <FontAwesomeIcon className="me-2" icon={props.icon} />
            {props.children} 
        </button>
    )
}