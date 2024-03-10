import loginImg from "../assets/images/login.png";

export default function Login() {
    return (
        <div className="bg-slate-100 flex justify-center items-center h-screen overflow-hidden">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src={loginImg} alt="Login image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4 text-center text-gradient">Welcome to Club4Stud</h1>
                <form action="#" method="POST">
                    <label className="block">
                        <p className="text-slate-600 mb-2">Email</p>
                        <input type="email" id="email" name="email" className="peer w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-violet-600" />
                        <p className="mt-1 invisible peer-invalid:visible text-indigo-600 text-sm">
                            Please provide a valid email address.
                        </p>
                    </label>
                    <div className="mb-8">
                        <label htmlFor="password" className="block text-slate-600 mb-2">Password</label>
                        <input type="password" id="password" name="password" className="peer w-full border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:border-violet-600" />
                        <p className="mt-1 invisible peer-invalid:visible text-indigo-600 text-sm">

                        </p>
                    </div>
                    <button type="submit" className="bg-gradient text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                </form>
            </div>
        </div>
    )
}