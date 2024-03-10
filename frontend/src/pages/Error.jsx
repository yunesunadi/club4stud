import { Link } from "react-router-dom";
import notFoundImg from "../assets/images/404.png";

export default function Error() {
    return (
        <section className="flex flex-col justify-center items-center h-screen">
            <img src={notFoundImg} alt="Page not found image" className="w-60 h-48 md:w-96 md:h-72" />
            <h3 className="text-xl text-violet-600 mb-3">Page not found</h3>
            <Link to="/login" className="underline text-violet-600">Back to home</Link>
        </section>
    )
}