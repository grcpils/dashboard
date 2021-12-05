import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BrandedButton(props) {
    const login = async () => {
        await props.onClick();
    }

    return (
        <button onClick={login} className={`mb-2 btn btn-${props.brand}`}>
            <FontAwesomeIcon className="me-2" icon={props.icon} />
            {props.children}
        </button>
    )
}