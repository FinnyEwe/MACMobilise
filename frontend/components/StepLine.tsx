import {useStepContext} from "./StepperContextProvider";

interface StepLineProps {
    id: number;
}

const StepLine = ({ id }: StepLineProps) => {


    const { stepNums }  = useStepContext()
    const widthPercentage = 100 / (stepNums - 1)

    return (
        <hr className="align-middle border-t-2 mx-4 min-w-9 w-max"/>
    )
}

export default StepLine
