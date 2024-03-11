export default function RadioBtn({ text, label, role, setRole }) {
    return (
        <div className="inline-flex items-center -ml-3 mr-3">
            <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="html">
                <input type="radio" name="role" value={text}
                    className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-slate-500 text-slate-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-slate-500 checked:before:bg-slate-500"
                    id={text} onChange={(e) => setRole(e.target.value)} checked={role === text} />
                <span
                    className="absolute text-slate-500 transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor">
                        <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                </span>
            </label>
            <label className="-ml-1 -mt-.5 text-slate-500 cursor-pointer select-none" htmlFor={text}>
                {label}
            </label>
        </div>

    )
}