type LoadingProp = {
    loopCount: number,
}

const Loading: React.FC<LoadingProp> = ({ loopCount }) => {
    return (
        <div className="flex flex-col gap-3 w-full">
            {new Array(loopCount).fill(null).map((_, index) => {
                return <div key={index} className="lg:h-[94px] dark:bg-[#130e22] h-[140px] flex lg:flex-row flex-col gap-6 justify-between items-start p-2 w-full rounded-sm bg-gray-200 animate-pulse">
                    <div className="flex flex-col gap-3">
                        <span className="h-[15px] w-[100px] bg-gray-300 dark:bg-gray-700 rounded-sm"></span>
                        <span className="h-[20px] sm:w-[250px] w-[220px] bg-gray-300 dark:bg-gray-700 rounded-sm"></span>
                        <span className="h-[15px] w-[185px] bg-gray-300 dark:bg-gray-700 rounded-sm"></span>
                    </div>
                    <div className="flex items-center justify-end lg:w-fit w-full gap-1">
                        <span className="h-[25px] rounded-sm w-[42px] bg-gray-300 dark:bg-gray-700"></span>
                        <span className="h-[25px] rounded-sm w-[60px] bg-gray-300 dark:bg-gray-700"></span>
                    </div>
                </div>
            })}
        </div>
    )
}

export default Loading;
