import {describe} from "node:test";
import StepLine from "./StepLine";
import {useStepContext} from "./StepperContextProvider";
interface StepProps {
    title: string
    description: string
    id: number
}

const Step: React.FC<StepProps> = ({title, description, id})=> {

    const { chosenId, stepNums } = useStepContext()


    return (
        <div className="flex items-center gap-5">
        <div className="flex gap-4">
            <div className="text-right max-w-72 text-nowrap">
                <p className="font-bold">{title}</p>
                <p className="text-gray-400 ">{description}</p>
            </div>
            <div className="rounded-full w-14 h-14 p-2 flex flex-shrink-0 self-center justify-center items-center bg-amber-300 text-black font-bold">
                {chosenId > id ? "Done" : id}
            </div>

        </div>
        {id < stepNums && <StepLine id={id}/>}
        </div>

    )
}

export default Step