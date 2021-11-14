
export function LoginBox(props) {
    return (
        <div className="App-login__box">
            {props.children}
        </div>
    )
}

export function LoginBoxTitle(props) {
    return (
        <div className="login-title">
            <h2 className="login-title__title">{props.title}</h2>
            <h4 className="login-title__subtitle">{props.subtitle}</h4>
        </div>
    )
}

export function LoginSeparator() {
    return (
        <div className="login-separator">
            <span>Or</span>
        </div>
    )
}