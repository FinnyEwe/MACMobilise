import {useStepContext} from "./StepperContextProvider";

interface StepperContainerProps {
    id: number
    children: React.ReactNode
}


const StepperContainer: React.FC<StepperContainerProps> = ({id, children})  => {

    const { setChosenId }  = useStepContext()

    setChosenId(id)

    return (
        <div className="flex">
            {children}
        </div>
    )
}

export default StepperContainer