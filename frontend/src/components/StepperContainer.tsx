import {useStepContext} from "./StepperContextProvider";
import { useEffect } from 'react';

interface StepperContainerProps {
    id: number
    children: React.ReactNode
}


const StepperContainer: React.FC<StepperContainerProps> = ({id, children})  => {

    const { setChosenId }  = useStepContext()

    useEffect(() => {
      setChosenId(id);
    }, [id, setChosenId])

    return (
        <div className="flex">
            {children}
        </div>
    )
}

export default StepperContainer