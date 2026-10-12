type HeaderProps = {
    title: string
    description: string 
}

export function Header({title, description}: HeaderProps){
    return(
        <header className="header">
            <h1>{ title }</h1>
            <p>{ description }</p>
        </header>
    )
}
