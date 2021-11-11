
function PageTitle(props) {
    return (
        <div className="page-title">
            <h2 className="page-title__title">{props.title}</h2>
            <h4 className="page-title__subtitle">{props.subtitle}</h4>
        </div>
    )
}

export default PageTitle;