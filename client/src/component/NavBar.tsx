import { Link } from "react-router-dom"

function Navbar() {
    return (
        <header className="bg-white border-gray-200 dark:bg-gray-900 border">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
                <Link to="/" className="flex">
                    <img src="https://dataneuron.ai/logo2.png" className="h-8" alt="DataNeuron Logo" />
                </Link>
            </div>
        </header>
    )
}

export default Navbar